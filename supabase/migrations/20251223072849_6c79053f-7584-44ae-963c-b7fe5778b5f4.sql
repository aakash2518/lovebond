-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can view couple members" ON public.profiles;

-- Create a security definer function to get user's couple_id without RLS
CREATE OR REPLACE FUNCTION public.get_user_couple_id(p_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT couple_id FROM public.profiles WHERE user_id = p_user_id LIMIT 1;
$$;

-- Recreate the policy using the function
CREATE POLICY "Users can view couple members"
ON public.profiles
FOR SELECT
USING (
  couple_id IS NOT NULL AND couple_id = public.get_user_couple_id(auth.uid())
);