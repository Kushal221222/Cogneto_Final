-- Update note
UPDATE notes
SET 
    title = COALESCE($2, title), -- title (if provided)
    content = COALESCE($3, content), -- content (if provided)
    tags = COALESCE($4, tags), -- tags (if provided)
    priority_type = COALESCE($5, priority_type), -- priority_type (if provided)
    due_date = COALESCE($6, due_date), -- due_date (if provided)
    image_url = COALESCE($7, image_url), -- image_url (if provided)
    favorite = COALESCE($8, favorite), -- favorite (if provided)
    is_task = COALESCE($9, is_task), -- is_task (if provided)
    completed = COALESCE($10, completed), -- completed (if provided)
    delegated_to = COALESCE($11, delegated_to), -- delegated_to (if provided)
    reminder_time = COALESCE($12, reminder_time), -- reminder_time (if provided)
    updated_at = NOW()
WHERE id = $1 -- note_id
AND user_id = $13 -- user_id
RETURNING *;
