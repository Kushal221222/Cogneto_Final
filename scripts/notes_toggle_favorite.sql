-- Toggle favorite status
UPDATE notes
SET 
    favorite = $2, -- new favorite status
    updated_at = NOW()
WHERE id = $1 -- note_id
AND user_id = $3 -- user_id
RETURNING *;
