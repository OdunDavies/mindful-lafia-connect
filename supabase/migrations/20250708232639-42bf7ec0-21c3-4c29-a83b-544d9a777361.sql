
-- Remove chat-related tables and their dependencies
DROP TABLE IF EXISTS public.chat_messages CASCADE;
DROP TABLE IF EXISTS public.chat_sessions CASCADE;

-- Remove triggers that are no longer needed for chat functionality
DROP TRIGGER IF EXISTS on_message_insert ON public.messages;

-- Update the update_last_seen function to only update on profile changes
CREATE OR REPLACE FUNCTION public.update_last_seen()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  UPDATE public.profiles 
  SET last_seen = NOW() 
  WHERE id = auth.uid();
  RETURN NEW;
END;
$function$;

-- Create trigger for profile updates only
CREATE TRIGGER on_profile_update
  AFTER UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_last_seen();
