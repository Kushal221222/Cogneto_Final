-- Create note
INSERT INTO notes (
    id,
    title,
    content,
    tags,
    user_id,
    favorite,
    deleted,
    priority_type,
    due_date,
    image_url,
    is_task,
    completed,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    $1, -- title
    $2, -- content
    $3, -- tags (array)
    $4, -- user_id
    false, -- favorite (default)
    false, -- deleted (default)
    $5, -- priority_type
    $6, -- due_date
    $7, -- image_url
    false, -- is_task (default)
    false, -- completed (default)
    NOW(),
    NOW()
)
RETURNING *;
