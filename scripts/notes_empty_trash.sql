-- Empty trash (delete all soft-deleted notes)
DELETE FROM notes
WHERE user_id = $1 -- user_id
AND deleted = true;
