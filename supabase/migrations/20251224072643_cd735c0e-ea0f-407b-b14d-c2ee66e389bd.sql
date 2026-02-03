-- Make photos bucket private
UPDATE storage.buckets SET public = false WHERE id = 'photos';

-- Drop the old "Anyone can view photos" policy
DROP POLICY IF EXISTS "Anyone can view photos" ON storage.objects;

-- Create new policy: Only authenticated couple members can view their photos
CREATE POLICY "Couple members can view their photos"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'photos' 
  AND auth.role() = 'authenticated'
  AND (
    -- User can view their own photos
    (storage.foldername(name))[1] = auth.uid()::text
    OR
    -- User can view their partner's photos
    (storage.foldername(name))[1] IN (
      SELECT p2.user_id::text
      FROM public.profiles p1
      JOIN public.profiles p2 ON p1.couple_id = p2.couple_id AND p1.id != p2.id
      WHERE p1.user_id = auth.uid()
    )
  )
);