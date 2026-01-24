-- Migration to add atomic increment function for project leads
CREATE OR REPLACE FUNCTION increment_project_leads(p_project_name TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE projects
  SET leads_count = COALESCE(leads_count, 0) + 1
  WHERE name = p_project_name;
END;
$$;
