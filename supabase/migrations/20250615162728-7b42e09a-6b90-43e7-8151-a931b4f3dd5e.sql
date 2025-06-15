
-- First, let's create a function to make a user admin (you'll run this after creating your admin account)
CREATE OR REPLACE FUNCTION make_user_admin(user_email TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.user_profiles 
  SET role = 'admin'
  WHERE user_id = (
    SELECT id FROM auth.users WHERE email = user_email
  );
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
END;
$$;

-- Create a view to easily see user roles (optional, for admin convenience)
CREATE OR REPLACE VIEW public.user_roles_view AS
SELECT 
  u.email,
  u.created_at as user_created_at,
  p.role,
  p.skin_tone,
  p.created_at as profile_created_at
FROM auth.users u
LEFT JOIN public.user_profiles p ON u.id = p.user_id
ORDER BY u.created_at DESC;
