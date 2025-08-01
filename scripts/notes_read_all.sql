-- Fetch all notes for user
SELECT *
FROM notes
WHERE user_id = $1 -- user_id
AND deleted = false
ORDER BY created_at DESC;
