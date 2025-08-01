-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('note-images', 'note-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif']),
    ('note-attachments', 'note-attachments', true, 10485760, NULL);
