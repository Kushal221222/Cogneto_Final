-- Profile update
UPDATE profiles 
SET 
    full_name = $2, -- full_name
    updated_at = NOW()
WHERE id = $1; -- user_id

-- Also update auth.users metadata
UPDATE auth.users 
SET 
    raw_user_meta_data = jsonb_set(
        COALESCE(raw_user_meta_data, '{}'),
        '{full_name}',
        to_jsonb($2) -- full_name
    ),
    updated_at = NOW()
WHERE id = $1; -- user_id
