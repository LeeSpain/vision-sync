-- ============================================================================
-- P3.1 — The Tenant Factory schema · Part C: provisioning & lifecycle workflow
-- BLUEPRINT §9, D6 (gate), D18 (SLA), D23 (change-request/sign-off two-lane)
--
-- Purely additive. Creates: provisioning_jobs, agent_test_runs,
-- change_requests, signoffs. RLS: admin full; tenant owner scoped.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- provisioning_jobs — the idempotent pipeline state machine (P3.4). One job
-- drives payment✓ → create → render → instantiate agent → test → gate → live.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.provisioning_jobs (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id       UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    status          TEXT NOT NULL DEFAULT 'queued'
                      CHECK (status IN (
                        'queued', 'creating', 'rendering', 'instantiating_agent',
                        'testing', 'awaiting_approval', 'approved', 'live',
                        'failed', 'cancelled')),
    current_step    TEXT,
    steps           JSONB NOT NULL DEFAULT '[]'::JSONB,   -- ordered step log for the "watched live" assembly (§9.5)
    error           TEXT,
    attempts        INTEGER NOT NULL DEFAULT 0,
    idempotency_key TEXT UNIQUE,                          -- resumability (kill mid-run → resume)
    started_at      TIMESTAMP WITH TIME ZONE,
    completed_at    TIMESTAMP WITH TIME ZONE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_provisioning_jobs_tenant_id ON public.provisioning_jobs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_provisioning_jobs_status ON public.provisioning_jobs(status);

ALTER TABLE public.provisioning_jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "provisioning_jobs admin full access" ON public.provisioning_jobs;
CREATE POLICY "provisioning_jobs admin full access"
ON public.provisioning_jobs FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Owner watches their own assembly progress (§9.5).
DROP POLICY IF EXISTS "provisioning_jobs owner can read" ON public.provisioning_jobs;
CREATE POLICY "provisioning_jobs owner can read"
ON public.provisioning_jobs FOR SELECT
USING (public.owns_tenant(tenant_id));

DROP TRIGGER IF EXISTS trg_provisioning_jobs_updated_at ON public.provisioning_jobs;
CREATE TRIGGER trg_provisioning_jobs_updated_at
BEFORE UPDATE ON public.provisioning_jobs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------------------------------------------------------------------------
-- agent_test_runs — the approval-gate test-suite runs (D6). pass_rate feeds
-- the P4 per-industry auto-approve dial-down.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.agent_test_runs (
    id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id           UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    provisioning_job_id UUID REFERENCES public.provisioning_jobs(id) ON DELETE SET NULL,
    status              TEXT NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending', 'running', 'passed', 'failed')),
    pass_rate           NUMERIC(5, 2),                    -- 0.00–100.00
    results             JSONB NOT NULL DEFAULT '[]'::JSONB, -- per-question results
    ran_at              TIMESTAMP WITH TIME ZONE,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_agent_test_runs_tenant_id ON public.agent_test_runs(tenant_id);

ALTER TABLE public.agent_test_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "agent_test_runs admin full access" ON public.agent_test_runs;
CREATE POLICY "agent_test_runs admin full access"
ON public.agent_test_runs FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Owner sees "final quality review by a human" status (§9.6).
DROP POLICY IF EXISTS "agent_test_runs owner can read" ON public.agent_test_runs;
CREATE POLICY "agent_test_runs owner can read"
ON public.agent_test_runs FOR SELECT
USING (public.owns_tenant(tenant_id));

DROP TRIGGER IF EXISTS trg_agent_test_runs_updated_at ON public.agent_test_runs;
CREATE TRIGGER trg_agent_test_runs_updated_at
BEFORE UPDATE ON public.agent_test_runs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------------------------------------------------------------------------
-- change_requests — D23 two-lane workflow. Lane 1 'facts' (self-serve) and
-- Lane 2 'structural' (request → quote → sign-off). Owner may open requests;
-- quoting/approval stays admin-controlled.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.change_requests (
    id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id     UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    requested_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    lane          TEXT NOT NULL DEFAULT 'structural'
                    CHECK (lane IN ('facts', 'structural')),
    title         TEXT NOT NULL,
    detail        TEXT,
    status        TEXT NOT NULL DEFAULT 'open'
                    CHECK (status IN ('open', 'quoted', 'awaiting_signoff', 'in_progress', 'done', 'rejected', 'cancelled')),
    scope         JSONB,                                  -- AI-drafted scope
    quoted_price  NUMERIC(10, 2),
    currency      TEXT NOT NULL DEFAULT 'EUR'
                    CHECK (currency IN ('EUR', 'USD', 'GBP')),
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at    TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_change_requests_tenant_id ON public.change_requests(tenant_id);
CREATE INDEX IF NOT EXISTS idx_change_requests_status ON public.change_requests(status);

ALTER TABLE public.change_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "change_requests admin full access" ON public.change_requests;
CREATE POLICY "change_requests admin full access"
ON public.change_requests FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Owner reads their tenant's requests …
DROP POLICY IF EXISTS "change_requests owner can read" ON public.change_requests;
CREATE POLICY "change_requests owner can read"
ON public.change_requests FOR SELECT
USING (public.owns_tenant(tenant_id));

-- … and opens new ones (must be for their own tenant, as themselves). Quoting
-- and status transitions are admin-only (no owner UPDATE policy) so a client
-- cannot self-approve a quote.
DROP POLICY IF EXISTS "change_requests owner can insert" ON public.change_requests;
CREATE POLICY "change_requests owner can insert"
ON public.change_requests FOR INSERT
WITH CHECK (public.owns_tenant(tenant_id) AND requested_by = auth.uid());

DROP TRIGGER IF EXISTS trg_change_requests_updated_at ON public.change_requests;
CREATE TRIGGER trg_change_requests_updated_at
BEFORE UPDATE ON public.change_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------------------------------------------------------------------------
-- signoffs — D23 timestamped, in-portal, append-only sign-off record
-- ("no 'but you said on WhatsApp' disputes"). Sign-off #1 (build), change
-- sign-offs, completion confirmations.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.signoffs (
    id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id         UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    change_request_id UUID REFERENCES public.change_requests(id) ON DELETE SET NULL,
    kind              TEXT NOT NULL
                        CHECK (kind IN ('build', 'change', 'completion')),
    signed_by         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    signed_at         TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
    meta              JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at        TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at        TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_signoffs_tenant_id ON public.signoffs(tenant_id);

ALTER TABLE public.signoffs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "signoffs admin full access" ON public.signoffs;
CREATE POLICY "signoffs admin full access"
ON public.signoffs FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Owner reads their tenant's sign-off record …
DROP POLICY IF EXISTS "signoffs owner can read" ON public.signoffs;
CREATE POLICY "signoffs owner can read"
ON public.signoffs FOR SELECT
USING (public.owns_tenant(tenant_id));

-- … and signs (append-only: INSERT only, no owner UPDATE/DELETE, so the record
-- is tamper-evident).
DROP POLICY IF EXISTS "signoffs owner can insert" ON public.signoffs;
CREATE POLICY "signoffs owner can insert"
ON public.signoffs FOR INSERT
WITH CHECK (public.owns_tenant(tenant_id) AND signed_by = auth.uid());

DROP TRIGGER IF EXISTS trg_signoffs_updated_at ON public.signoffs;
CREATE TRIGGER trg_signoffs_updated_at
BEFORE UPDATE ON public.signoffs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
