-- User signin operation
-- This is handled by Supabase Auth
SELECT 
    u.id,
    u.email,
    u.encrypted_password,
    u.email_confirmed_at,
    u.raw_user_meta_data,
    u.created_at,
    u.updated_at
FROM auth.users u
WHERE u.email = $1 -- email
AND u.encrypted_password = crypt($2, u.encrypted_password) -- password verification
AND u.email_confirmed_at IS NOT NULL;

-- Update last sign in
UPDATE auth.users 
SET 
    last_sign_in_at = NOW(),
    updated_at = NOW()
WHERE id = $1; -- user_id
