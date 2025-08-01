-- User signup operation
-- This is handled by Supabase Auth, but creates entries in auth.users table
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data
) VALUES (
    gen_random_uuid(),
    $1, -- email
    crypt($2, gen_salt('bf')), -- password
    NULL, -- email_confirmed_at (NULL until confirmed)
    NOW(),
    NOW(),
    jsonb_build_object('full_name', $3) -- full_name from signup
);

-- Email confirmation record
INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    $1, -- user_id
    jsonb_build_object('email', $2), -- email
    'email',
    NOW(),
    NOW()
);
