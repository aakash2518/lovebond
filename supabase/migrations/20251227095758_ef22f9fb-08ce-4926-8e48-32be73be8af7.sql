-- Fix infinite recursion in profiles RLS by replacing self-referential subquery with SECURITY DEFINER helper

CREATE OR REPLACE FUNCTION public.get_user_partner_profile_id(p_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT partner_id
  FROM public.profiles
  WHERE user_id = p_user_id
  LIMIT 1;
$$;

DROP POLICY IF EXISTS "Users can view their partner profile" ON public.profiles;

CREATE POLICY "Users can view their partner profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  id = public.get_user_partner_profile_id(auth.uid())
);


-- Harden couples INSERT policy (and allow creator to read their newly created couple)

ALTER TABLE public.couples
ADD COLUMN IF NOT EXISTS created_by uuid;

ALTER TABLE public.couples
ALTER COLUMN created_by SET DEFAULT auth.uid();

DROP POLICY IF EXISTS "Authenticated users can create couples" ON public.couples;

CREATE POLICY "Authenticated users can create couples"
ON public.couples
FOR INSERT
TO authenticated
WITH CHECK (
  created_by = auth.uid()
);

DROP POLICY IF EXISTS "Users can view their own couple" ON public.couples;

CREATE POLICY "Users can view their own couple"
ON public.couples
FOR SELECT
TO authenticated
USING (
  created_by = auth.uid()
  OR id = public.get_user_couple_id(auth.uid())
);
