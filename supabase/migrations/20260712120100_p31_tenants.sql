-- ============================================================================
-- P3.1 — The Tenant Factory schema · Part B: tenant core
-- BLUEPRINT §2.2 (TenantConfig = one artifact), D4, D5 (subdomains), D13 (currency)
--
-- Purely additive. Creates: tenants, tenant_configs (versioned), tenant_nodes
-- (+ owns_tenant() helper). RLS: admin full; tenant owner scoped to their own.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- tenants — one row per client. owner_id = the client's auth user.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tenants (
    id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name             TEXT NOT NULL,                       -- business name
    subdomain        TEXT NOT NULL UNIQUE,                -- 'maria-salon' (→ maria-salon.vision-sync.co, D5)
    industry_pack_id UUID REFERENCES public.industry_packs(id) ON DELETE RESTRICT,
    tier             TEXT NOT NULL DEFAULT 'base'
                       CHECK (tier IN ('base', 'growth', 'everything')),
    status           TEXT NOT NULL DEFAULT 'draft'
                       CHECK (status IN ('draft', 'sandbox', 'pending_approval', 'live', 'suspended', 'cancelled')),
    currency         TEXT NOT NULL DEFAULT 'EUR'          -- D13 (€/$/£)
                       CHECK (currency IN ('EUR', 'USD', 'GBP')),
    created_at       TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at       TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tenants_owner_id ON public.tenants(owner_id);
CREATE INDEX IF NOT EXISTS idx_tenants_industry_pack_id ON public.tenants(industry_pack_id);

ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- owns_tenant(): reusable tenant-scoping check for child tables. SECURITY
-- DEFINER + pinned search_path. Created AFTER public.tenants exists (a SQL
-- function body is validated at creation time).
CREATE OR REPLACE FUNCTION public.owns_tenant(tenant UUID)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.tenants
    WHERE id = tenant AND owner_id = auth.uid()
  );
$$;

-- Admin manages all tenants (creation is admin/provisioning via service role).
DROP POLICY IF EXISTS "tenants admin full access" ON public.tenants;
CREATE POLICY "tenants admin full access"
ON public.tenants FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Owner may read their own tenant.
DROP POLICY IF EXISTS "tenants owner can read own" ON public.tenants;
CREATE POLICY "tenants owner can read own"
ON public.tenants FOR SELECT
USING (owner_id = auth.uid());

-- Owner may update limited fields on their own tenant (portal). Cannot change
-- owner_id/subdomain arbitrarily via app logic — RLS guards the row; column
-- protection is enforced in the API/edge layer.
DROP POLICY IF EXISTS "tenants owner can update own" ON public.tenants;
CREATE POLICY "tenants owner can update own"
ON public.tenants FOR UPDATE
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

DROP TRIGGER IF EXISTS trg_tenants_updated_at ON public.tenants;
CREATE TRIGGER trg_tenants_updated_at
BEFORE UPDATE ON public.tenants
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------------------------------------------------------------------------
-- tenant_configs — the versioned TenantConfig JSON artifact. One active
-- version per tenant; new versions append (D20 plan-versioning spirit).
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tenant_configs (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id   UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    version     INTEGER NOT NULL,
    config      JSONB NOT NULL,                           -- full TenantConfig
    is_active   BOOLEAN NOT NULL DEFAULT false,           -- the currently-live version
    created_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (tenant_id, version)
);

-- At most one active config version per tenant.
CREATE UNIQUE INDEX IF NOT EXISTS uniq_tenant_configs_one_active
ON public.tenant_configs(tenant_id) WHERE is_active;

ALTER TABLE public.tenant_configs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tenant_configs admin full access" ON public.tenant_configs;
CREATE POLICY "tenant_configs admin full access"
ON public.tenant_configs FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Owner reads their tenant's config history (writes go through provisioning /
-- Lane-1 flows on the service role).
DROP POLICY IF EXISTS "tenant_configs owner can read" ON public.tenant_configs;
CREATE POLICY "tenant_configs owner can read"
ON public.tenant_configs FOR SELECT
USING (public.owns_tenant(tenant_id));

DROP TRIGGER IF EXISTS trg_tenant_configs_updated_at ON public.tenant_configs;
CREATE TRIGGER trg_tenant_configs_updated_at
BEFORE UPDATE ON public.tenant_configs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------------------------------------------------------------------------
-- tenant_nodes — which nodes a tenant has enabled, with per-tenant config.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tenant_nodes (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id   UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    node_id     UUID NOT NULL REFERENCES public.nodes(id) ON DELETE RESTRICT,
    is_enabled  BOOLEAN NOT NULL DEFAULT true,
    config      JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (tenant_id, node_id)
);

CREATE INDEX IF NOT EXISTS idx_tenant_nodes_tenant_id ON public.tenant_nodes(tenant_id);

ALTER TABLE public.tenant_nodes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tenant_nodes admin full access" ON public.tenant_nodes;
CREATE POLICY "tenant_nodes admin full access"
ON public.tenant_nodes FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "tenant_nodes owner can read" ON public.tenant_nodes;
CREATE POLICY "tenant_nodes owner can read"
ON public.tenant_nodes FOR SELECT
USING (public.owns_tenant(tenant_id));

DROP TRIGGER IF EXISTS trg_tenant_nodes_updated_at ON public.tenant_nodes;
CREATE TRIGGER trg_tenant_nodes_updated_at
BEFORE UPDATE ON public.tenant_nodes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
