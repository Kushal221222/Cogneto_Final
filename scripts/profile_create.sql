-- Profile creation/update (upsert)
INSERT INTO profiles (
    id,
    full_name,
    email,
    updated_at
) VALUES (
    $1, -- user_id
    $2, -- full_name
    $3, -- email
    NOW()
)
ON CONFLICT (id) 
DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    updated_at = NOW();
