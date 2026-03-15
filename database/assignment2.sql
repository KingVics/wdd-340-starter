-- QUERY ONE --
INSERT INTO public.account
	VALUES (default, 'Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n', default);


-- QUERY  TWO --
UPDATE public.account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

-- QUERY THREE --
DELETE FROM public.account
WHERE account_id = 1;

-- QUERY FOUR --
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- QUERY FIVE --
SELECT inv_make, inv_model
	FROM public.inventory AS inv
JOIN public.classification AS cls
	ON inv.classification_id = cls.classification_id
WHERE cls.classification_name = 'Sport';

-- QUERY SIX --
UPDATE public.inventory
	SET
	inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
	inv_thumbnail = REPLACE(inv_image, '/images/', '/images/vehicles/');