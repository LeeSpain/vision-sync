-- Ensure trigger exists to create profiles on new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Ensure a profile exists for the target admin email and promote to admin
-- Replace the email below if needed
WITH target AS (
  SELECT id, email, COALESCE(raw_user_meta_data->>'full_name','') AS full_name
  FROM auth.users
  WHERE email = 'leewakeman@hotmail.co.uk'
)
INSERT INTO public.profiles (id, email, full_name, role)
SELECT t.id, t.email, t.full_name, 'admin'
FROM target t
ON CONFLICT (id) DO NOTHING;

-- Promote the target user to admin role
UPDATE public.profiles p
SET role = 'admin'
FROM auth.users u
WHERE u.email = 'leewakeman@hotmail.co.uk'
  AND p.id = u.id;