-- Update user account to admin role
UPDATE public.user_profiles 
SET role = 'admin'::user_role 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'amr.a.ramzi@gmail.com');