-- Add relationship details fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS partner_nickname text,
ADD COLUMN IF NOT EXISTS relationship_start_date date;