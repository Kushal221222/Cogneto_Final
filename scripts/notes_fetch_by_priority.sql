-- Fetch notes by priority
SELECT *
FROM notes
WHERE user_id = $1 -- user_id
AND deleted = false
AND priority_type = $2 -- priority_type
ORDER BY updated_at DESC;
