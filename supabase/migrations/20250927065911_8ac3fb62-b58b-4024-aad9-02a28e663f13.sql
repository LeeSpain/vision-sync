-- Update existing projects with appropriate content_section values
UPDATE projects 
SET content_section = 'featured'
WHERE id IN ('76e66eb9-d6a0-4a81-bc6a-6c51265abd6c', 'f42dfba0-5044-4233-a2aa-e710530ac7a2');

UPDATE projects 
SET content_section = 'platforms-for-sale'
WHERE id = '73bd3b30-5b9a-4aba-a7ba-887e80772212';