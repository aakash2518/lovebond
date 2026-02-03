-- First drop storage policies that depend on profiles.user_id
DROP POLICY IF EXISTS "Couple members can view their photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own photos" ON storage.objects;

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view couple members" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their partner profile" ON public.profiles;

DROP POLICY IF EXISTS "Users can view their own streak" ON public.love_streaks;
DROP POLICY IF EXISTS "Users can insert their own streak" ON public.love_streaks;
DROP POLICY IF EXISTS "Users can update their own streak" ON public.love_streaks;

DROP POLICY IF EXISTS "Users can view their own photos" ON public.daily_photos;
DROP POLICY IF EXISTS "Users can view partner photos" ON public.daily_photos;
DROP POLICY IF EXISTS "Users can insert their own photos" ON public.daily_photos;

DROP POLICY IF EXISTS "Users can view messages they sent or received" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Receivers can update message read status" ON public.messages;
DROP POLICY IF EXISTS "Senders can delete their own messages" ON public.messages;

DROP POLICY IF EXISTS "Users can view their own completed activities" ON public.user_activities;
DROP POLICY IF EXISTS "Users can insert their own activities" ON public.user_activities;

DROP POLICY IF EXISTS "Users can view their own location" ON public.user_locations;
DROP POLICY IF EXISTS "Users can view partner location" ON public.user_locations;
DROP POLICY IF EXISTS "Users can insert their own location" ON public.user_locations;
DROP POLICY IF EXISTS "Users can update their own location" ON public.user_locations;

DROP POLICY IF EXISTS "Authenticated users can create couples" ON public.couples;
DROP POLICY IF EXISTS "Users can view their own couple" ON public.couples;

-- Drop existing functions
DROP FUNCTION IF EXISTS public.get_user_couple_id(uuid);
DROP FUNCTION IF EXISTS public.get_user_partner_profile_id(uuid);

-- Drop foreign key constraints that reference auth.users
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;
ALTER TABLE public.love_streaks DROP CONSTRAINT IF EXISTS love_streaks_user_id_fkey;
ALTER TABLE public.daily_photos DROP CONSTRAINT IF EXISTS daily_photos_user_id_fkey;
ALTER TABLE public.messages DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;
ALTER TABLE public.messages DROP CONSTRAINT IF EXISTS messages_receiver_id_fkey;
ALTER TABLE public.user_activities DROP CONSTRAINT IF EXISTS user_activities_user_id_fkey;
ALTER TABLE public.user_locations DROP CONSTRAINT IF EXISTS user_locations_user_id_fkey;
ALTER TABLE public.couples DROP CONSTRAINT IF EXISTS couples_created_by_fkey;

-- Alter columns from UUID to TEXT
ALTER TABLE public.profiles ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;
ALTER TABLE public.love_streaks ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;
ALTER TABLE public.daily_photos ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;
ALTER TABLE public.messages ALTER COLUMN sender_id TYPE TEXT USING sender_id::TEXT;
ALTER TABLE public.messages ALTER COLUMN receiver_id TYPE TEXT USING receiver_id::TEXT;
ALTER TABLE public.user_activities ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;
ALTER TABLE public.user_locations ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;
ALTER TABLE public.couples ALTER COLUMN created_by TYPE TEXT USING created_by::TEXT;

-- Recreate functions with TEXT type
CREATE OR REPLACE FUNCTION public.get_user_couple_id(p_user_id TEXT)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT couple_id FROM public.profiles WHERE user_id = p_user_id LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_user_partner_profile_id(p_user_id TEXT)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT partner_id FROM public.profiles WHERE user_id = p_user_id LIMIT 1;
$$;

-- Recreate RLS policies (simplified for Firebase auth - application handles user isolation)
CREATE POLICY "Allow all operations on profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on love_streaks" ON public.love_streaks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on daily_photos" ON public.daily_photos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on messages" ON public.messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on user_activities" ON public.user_activities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on user_locations" ON public.user_locations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on couples" ON public.couples FOR ALL USING (true) WITH CHECK (true);

-- Add unique constraint on user_id for user_locations and profiles
ALTER TABLE public.user_locations DROP CONSTRAINT IF EXISTS user_locations_user_id_key;
ALTER TABLE public.user_locations ADD CONSTRAINT user_locations_user_id_key UNIQUE (user_id);

-- Recreate storage policies
CREATE POLICY "Allow all on photos bucket" ON storage.objects FOR ALL USING (bucket_id = 'photos') WITH CHECK (bucket_id = 'photos');