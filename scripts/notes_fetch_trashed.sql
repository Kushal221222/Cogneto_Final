-- Fetch trashed notes
SELECT *
FROM notes
WHERE user_id = $1 -- user_id
AND deleted = true
ORDER BY deleted_at DESC;
