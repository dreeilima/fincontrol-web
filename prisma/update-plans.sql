-- Atualizar planos existentes
UPDATE plans 
SET max_transactions = 10, can_create_categories = false 
WHERE name != 'Premium';

UPDATE plans 
SET max_transactions = NULL, can_create_categories = true 
WHERE name = 'Premium';

-- Atualizar plano gratuito
INSERT INTO plans (id, name, description, price, max_transactions, can_create_categories, features, benefits, limitations, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Gratuito',
  'Plano gratuito com recursos básicos',
  0,
  10,
  false,
  ARRAY['Até 10 transações por mês'],
  ARRAY['Sem custo'],
  ARRAY['Limite de 10 transações'],
  NOW(),
  NOW()
);

-- Atualizar plano premium
INSERT INTO plans (id, name, description, price, max_transactions, can_create_categories, features, benefits, limitations, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Premium',
  'Plano premium com recursos ilimitados',
  19.90,
  NULL,
  true,
  ARRAY['Transações ilimitadas'],
  ARRAY['Sem limite de transações'],
  ARRAY[]::text[],
  NOW(),
  NOW()
); 