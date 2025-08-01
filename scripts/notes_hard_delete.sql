-- Hard delete note (permanent)
DELETE FROM notes
WHERE id = $1 -- note_id
AND user_id = $2; -- user_id
