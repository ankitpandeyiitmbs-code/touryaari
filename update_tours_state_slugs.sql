-- Update tours with correct state_slug values

-- Himachal Pradesh tours
UPDATE tours SET state = 'Himachal Pradesh', state_slug = 'himachal-pradesh' 
WHERE destination IN ('Kasol', 'Mcleodganj', 'Manali', 'Jibhi', 'Spiti Valley');

-- Uttar Pradesh tours
UPDATE tours SET state = 'Uttar Pradesh', state_slug = 'uttar-pradesh' 
WHERE destination IN ('Varanasi', 'Agra', 'Mathura', 'Vrindavan');

-- Delhi tours
UPDATE tours SET state = 'Delhi', state_slug = 'delhi' 
WHERE destination = 'Delhi';

-- Ladakh tours
UPDATE tours SET state = 'Ladakh', state_slug = 'ladakh' 
WHERE destination = 'Leh';
