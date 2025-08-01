-- Restore note from trash
UPDATE notes
SET 
    deleted = false,
    deleted_at = NULL
WHERE id = $1 -- note_id
AND user_id = $2 -- user_id
RETURNING *;
