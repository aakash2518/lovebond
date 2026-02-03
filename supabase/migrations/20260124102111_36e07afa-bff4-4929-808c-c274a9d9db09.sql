-- Create user_locations table for live location tracking
CREATE TABLE public.user_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  accuracy DOUBLE PRECISION,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_locations ENABLE ROW LEVEL SECURITY;

-- Users can insert/update their own location
CREATE POLICY "Users can insert their own location"
ON public.user_locations
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own location"
ON public.user_locations
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can view their own location
CREATE POLICY "Users can view their own location"
ON public.user_locations
FOR SELECT
USING (auth.uid() = user_id);

-- Users can view their partner's location (using the existing partner_id function)
CREATE POLICY "Users can view partner location"
ON public.user_locations
FOR SELECT
USING (user_id = get_user_partner_profile_id(auth.uid()));

-- Enable realtime for location updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_locations;