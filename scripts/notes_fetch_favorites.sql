-- Fetch favorite notes
SELECT *
FROM notes
WHERE user_id = $1 -- user_id
AND deleted = false
AND favorite = true
ORDER BY updated_at DESC;
