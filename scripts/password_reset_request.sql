-- Password reset request
-- Creates a recovery token
INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM auth.users WHERE email = $1), -- email
    jsonb_build_object('email', $1),
    'recovery',
    NOW(),
    NOW()
);

-- This would also send an email with recovery link
