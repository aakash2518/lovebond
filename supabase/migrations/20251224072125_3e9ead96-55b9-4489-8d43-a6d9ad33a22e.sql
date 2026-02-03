-- Allow only the receiver to update messages (for marking as read)
CREATE POLICY "Receivers can update message read status" 
ON public.messages 
FOR UPDATE 
USING (auth.uid() = receiver_id)
WITH CHECK (auth.uid() = receiver_id);

-- Allow senders to delete their own messages
CREATE POLICY "Senders can delete their own messages" 
ON public.messages 
FOR DELETE 
USING (auth.uid() = sender_id);