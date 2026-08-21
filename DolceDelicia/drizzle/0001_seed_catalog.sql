INSERT INTO `categories` (`slug`, `name`, `description`, `sort_order`) VALUES
  ('doces', 'Doces', 'Sobremesas, bolos e receitas artesanais.', 1),
  ('salgados', 'Salgados', 'Opções assadas e fritas para qualquer hora.', 2),
  ('combos', 'Festas e encomendas', 'Combos preparados para celebrar.', 3),
  ('bebidas', 'Bebidas', 'Bebidas quentes e refrescantes.', 4),
  ('refeicoes', 'Refeições', 'Pratos completos para o seu dia.', 5);
--> statement-breakpoint
INSERT INTO `locations` (`slug`, `name`, `subtitle`, `address`, `contact`, `whatsapp`, `hours`, `image_url`, `maps_url`, `sort_order`) VALUES
  ('biopark', 'Biopark', 'Edifício Charles Darwin', 'Av. Max Planck, 3797 — Biopark, Toledo — PR, 85920-025', '(45) 99806-4748', '5545998064748', 'Segunda a sexta, das 7h às 22h30', '/images/units/biopark.jpg', 'https://www.google.com/maps/search/?api=1&query=Av.+Max+Planck+3797+Toledo+PR', 1),
  ('matriz', 'Matriz', 'Dolce Delícia Alimentos', 'Rua São João, 7408 — Jardim Gisela, Toledo — PR, 85905-055', '(45) 99806-4748', '5545998064748', 'Segunda a sexta, das 7h às 17h', '/images/units/matriz.jpg', 'https://www.google.com/maps/search/?api=1&query=Rua+Sao+Joao+7408+Toledo+PR', 2),
  ('filial', 'Filial', 'Dolce Delícia Lancheira Feliz', 'Rua Guarani, 2463 — Jardim La Salle, Toledo — PR, 85902-030', '(45) 99806-4748', '5545998064748', 'Segunda a sexta, das 9h às 18h30', '/images/units/filial.jpeg', 'https://www.google.com/maps/search/?api=1&query=Rua+Guarani+2463+Toledo+PR', 3);
--> statement-breakpoint
INSERT INTO `products` (`slug`, `name`, `description`, `image_url`, `category_id`) VALUES
  ('bombom-aberto', 'Bombom aberto', 'Sobremesa cremosa com chocolate e fruta, preparada em camadas.', '/images/menu/bombom.jpg', (SELECT id FROM categories WHERE slug = 'doces')),
  ('donuts', 'Donuts', 'Massa macia, cobertura generosa e aquele toque divertido.', '/images/menu/donuts.jpg', (SELECT id FROM categories WHERE slug = 'doces')),
  ('fatia-bolo', 'Fatia de bolo', 'Uma pausa doce com sabor de receita feita em casa.', '/images/menu/fatia.jpg', (SELECT id FROM categories WHERE slug = 'doces')),
  ('brownie', 'Brownie grande', 'Chocolate intenso, centro macio e casquinha delicada.', '/images/menu/brownie.jpg', (SELECT id FROM categories WHERE slug = 'doces')),
  ('cupcakes', 'Cupcakes — 100 un.', 'Encomenda especial para celebrar com cor e muito sabor.', '/images/menu/cupcakes.jpg', (SELECT id FROM categories WHERE slug = 'combos')),
  ('cento-salgados', 'Salgados fritos — 100 un.', 'Coxinha, bolinha de queijo, pastel, quibe e outras opções.', '/images/menu/cento-misto.jpg', (SELECT id FROM categories WHERE slug = 'combos')),
  ('coxinha', 'Coxinha', 'Clássica, dourada e com recheio de frango bem temperado.', '/images/menu/coxinhas.jpg', (SELECT id FROM categories WHERE slug = 'salgados')),
  ('empadinha', 'Empadinha', 'Massa delicada e recheio cremoso de frango.', '/images/menu/empadinha.jpg', (SELECT id FROM categories WHERE slug = 'salgados')),
  ('assado-calabresa', 'Assado de calabresa', 'Massa leve e recheio saboroso, ideal para qualquer hora.', '/images/menu/assado.jpg', (SELECT id FROM categories WHERE slug = 'salgados')),
  ('cappuccino', 'Cappuccino italiano', 'Café cremoso para acompanhar um doce ou uma boa conversa.', '/images/menu/cappuccino.jpg', (SELECT id FROM categories WHERE slug = 'bebidas')),
  ('suco-morango', 'Suco de morango', 'Refrescante, frutado e preparado na hora.', '/images/menu/suco-morango.jpg', (SELECT id FROM categories WHERE slug = 'bebidas')),
  ('strogonoff', 'Strogonoff', 'Arroz, batata palha e strogonoff de carne.', '/images/menu/strogonoff.jpg', (SELECT id FROM categories WHERE slug = 'refeicoes'));
--> statement-breakpoint
INSERT INTO `menu_items` (`product_id`, `location_id`, `price`, `available`, `badge`)
SELECT p.id, l.id,
  CASE p.slug
    WHEN 'bombom-aberto' THEN 11.00 WHEN 'donuts' THEN 8.50 WHEN 'fatia-bolo' THEN 4.00
    WHEN 'brownie' THEN 12.00 WHEN 'cupcakes' THEN 350.00 WHEN 'cento-salgados' THEN 85.00
    WHEN 'coxinha' THEN 8.00 WHEN 'empadinha' THEN 9.00 WHEN 'assado-calabresa' THEN 8.00
    WHEN 'cappuccino' THEN 11.99 WHEN 'suco-morango' THEN 8.00 WHEN 'strogonoff' THEN 20.00
  END,
  CASE WHEN l.slug = 'filial' AND p.slug = 'strogonoff' THEN 0 ELSE 1 END,
  CASE p.slug WHEN 'bombom-aberto' THEN 'Queridinho' WHEN 'cupcakes' THEN 'Encomenda' WHEN 'cento-salgados' THEN 'Para festas' WHEN 'strogonoff' THEN 'Executivo' ELSE NULL END
FROM products p CROSS JOIN locations l;
--> statement-breakpoint
INSERT INTO `promotions` (`title`, `description`, `image_url`, `product_id`, `location_id`, `promotional_price`, `starts_at`, `ends_at`) VALUES
  ('Doce da semana', 'Bombom aberto com preço especial em todas as unidades.', '/images/menu/bombom.jpg', (SELECT id FROM products WHERE slug = 'bombom-aberto'), NULL, 9.90, '2026-01-01T00:00:00.000Z', '2030-12-31T23:59:59.999Z'),
  ('Pausa no Biopark', 'Cappuccino italiano com valor promocional no Biopark.', '/images/menu/cappuccino.jpg', (SELECT id FROM products WHERE slug = 'cappuccino'), (SELECT id FROM locations WHERE slug = 'biopark'), 9.99, '2026-01-01T00:00:00.000Z', '2030-12-31T23:59:59.999Z');
--> statement-breakpoint
INSERT INTO `admins` (`user_id`, `email`, `name`, `role`, `active`) VALUES
  (NULL, 'andre.marvin.ferreira2@gmail.com', 'André Marvin', 'owner', 1);
