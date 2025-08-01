-- Soft delete note (move to trash)
UPDATE notes
SET 
    deleted = true,
    deleted_at = NOW()
WHERE id = $1 -- note_id
AND user_id = $2; -- user_id
