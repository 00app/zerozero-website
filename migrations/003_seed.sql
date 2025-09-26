-- Places
INSERT INTO places (city, lat, lng) VALUES
  ('London', 51.5072, -0.1276),
  ('Brighton', 50.8225, -0.1372),
  ('Staffordshire', 52.8793, -2.0570),
  ('Huddersfield', 53.6458, -1.7850),
  ('Accra', 5.5600, -0.2050),
  ('Lisbon', 38.7169, -9.1390),
  ('Comporta', 38.3833, -8.7833);

-- Tips
INSERT INTO tips (city, category, title, body, savings_est, carbon_est, freshness_rank, rotation_bucket) VALUES
  ('London', 'food', 'Eat seasonal veg', 'Swap to local, seasonal veg and cut 1kg CO₂ weekly.', 5, 1.0, 1, 'A'),
  ('Lisbon', 'travel', 'Use metro not car', 'Lisbon metro cuts your emissions by 80% vs. driving.', 10, 2.0, 1, 'A'),
  ('Accra', 'energy', 'Switch off AC', 'Save energy costs by switching off AC when not in use.', 15, 3.0, 1, 'A');

-- Offers (link to tips via tip_id)
INSERT INTO offers (tip_id, partner, url)
SELECT id, 'OLIO', 'https://olioex.com/'
FROM tips WHERE city = 'London' LIMIT 1;

INSERT INTO offers (tip_id, partner, url)
SELECT id, 'Too Good To Go', 'https://toogoodtogo.com/'
FROM tips WHERE city = 'Lisbon' LIMIT 1;

INSERT INTO offers (tip_id, partner, url)
SELECT id, 'MEST Africa', 'https://meltwater.org/'
FROM tips WHERE city = 'Accra' LIMIT 1;


