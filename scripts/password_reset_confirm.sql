-- Password reset confirmation
UPDATE auth.users 
SET 
    encrypted_password = crypt($1, gen_salt('bf')), -- new password
    updated_at = NOW()
WHERE id = $2; -- user_id from recovery token

-- Remove recovery tokens
DELETE FROM auth.identities 
WHERE user_id = $1 AND provider = 'recovery';
