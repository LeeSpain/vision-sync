-- Update the billing_type check constraint to include 'make_offer'
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_billing_type_check;
ALTER TABLE projects ADD CONSTRAINT projects_billing_type_check 
  CHECK (billing_type IN ('free', 'one-time', 'subscription', 'investment', 'make_offer'));

-- Update the status check constraint to include 'under_offer'
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_status_check;
ALTER TABLE projects ADD CONSTRAINT projects_status_check 
  CHECK (status IN ('active', 'development', 'sold', 'funded', 'archived', 'paused', 'under_offer'));