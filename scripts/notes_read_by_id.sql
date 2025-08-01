-- Fetch note by ID
SELECT *
FROM notes
WHERE id = $1 -- note_id
AND user_id = $2 -- user_id
AND deleted = false;
