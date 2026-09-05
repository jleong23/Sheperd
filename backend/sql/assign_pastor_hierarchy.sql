-- Update the users table so the attached leaders are assigned to the pastor account
-- from the supplied CSV export.

UPDATE public.users
SET pastor_id = 'f917a2a6-4a25-4771-8082-df6417bb4600'
WHERE leader_id = '06cf6ee2-c9a3-4f8f-9145-43c241d59614';

UPDATE public.users
SET pastor_id = 'f917a2a6-4a25-4771-8082-df6417bb4600'
WHERE leader_id = '6bc03637-ec22-46f3-9cad-f9cee30264a6';

UPDATE public.users
SET pastor_id = 'f917a2a6-4a25-4771-8082-df6417bb4600'
WHERE leader_id = 'a2709f39-6b10-45da-80e7-933277ed01e5';
