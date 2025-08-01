-- Account deletion - Profile deletion
DELETE FROM profiles WHERE id = $1; -- user_id

-- Account deletion - Notes deletion (handled by RPC function)
-- This is the delete_user RPC function
CREATE OR REPLACE FUNCTION delete_user(user_id UUID)
RETURNS void AS $$
BEGIN
    -- Delete user's notes
    DELETE FROM notes WHERE user_id = user_id;
    
    -- Delete user's profile
    DELETE FROM profiles WHERE id = user_id;
    
    -- Delete from auth.users (this might be restricted)
    DELETE FROM auth.users WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Call the function
SELECT delete_user($1); -- user_id
