-- Create couples table with unique code
CREATE TABLE public.couples (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_code TEXT NOT NULL UNIQUE DEFAULT substr(md5(random()::text), 1, 8),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on couples
ALTER TABLE public.couples ENABLE ROW LEVEL SECURITY;

-- Add couple_id to profiles
ALTER TABLE public.profiles ADD COLUMN couple_id UUID REFERENCES public.couples(id);

-- Create index for faster lookups
CREATE INDEX idx_profiles_couple_id ON public.profiles(couple_id);
CREATE INDEX idx_couples_code ON public.couples(couple_code);

-- RLS policies for couples table
CREATE POLICY "Users can view their own couple"
ON public.couples
FOR SELECT
USING (
  id IN (SELECT couple_id FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Authenticated users can create couples"
ON public.couples
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Update profiles RLS to allow viewing couple members
CREATE POLICY "Users can view couple members"
ON public.profiles
FOR SELECT
USING (
  couple_id IN (SELECT couple_id FROM public.profiles WHERE user_id = auth.uid() AND couple_id IS NOT NULL)
);

-- Function to join a couple by code
CREATE OR REPLACE FUNCTION public.join_couple(p_couple_code TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_couple_id UUID;
  v_member_count INT;
BEGIN
  -- Find couple by code
  SELECT id INTO v_couple_id FROM public.couples WHERE couple_code = p_couple_code;
  
  IF v_couple_id IS NULL THEN
    RAISE EXCEPTION 'Invalid couple code';
  END IF;
  
  -- Check if couple already has 2 members
  SELECT COUNT(*) INTO v_member_count FROM public.profiles WHERE couple_id = v_couple_id;
  
  IF v_member_count >= 2 THEN
    RAISE EXCEPTION 'This couple already has two members';
  END IF;
  
  -- Update current user's profile with couple_id
  UPDATE public.profiles SET couple_id = v_couple_id WHERE user_id = auth.uid();
  
  -- Also set partner_id for both users
  UPDATE public.profiles p1
  SET partner_id = p2.id
  FROM public.profiles p2
  WHERE p1.couple_id = v_couple_id 
    AND p2.couple_id = v_couple_id 
    AND p1.id != p2.id;
  
  RETURN v_couple_id;
END;
$$;

-- Update trigger for couples updated_at
CREATE TRIGGER update_couples_updated_at
BEFORE UPDATE ON public.couples
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();