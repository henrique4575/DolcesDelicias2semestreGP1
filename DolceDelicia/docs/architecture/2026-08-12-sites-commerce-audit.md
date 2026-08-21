# Auditoria de arquitetura — MVP comercial Dolce Delícia

## Resultado

O projeto atual é uma aplicação vinext/React executada em Cloudflare Workers pelo ChatGPT Sites. A plataforma já fornece os quatro recursos necessários ao MVP:

- código server-side por rotas `app/api`;
- D1 com binding lógico configurável e migrations empacotadas;
- R2 com binding lógico configurável para imagens;
- autenticação SIWC gerenciada pelo dispatcher, com identidade encaminhada por headers.

Não há limitação que justifique PostgreSQL, Supabase, Firebase, Render ou outro serviço externo nesta fase.

## Decisões

- D1 será a fonte de verdade para categorias, produtos, unidades, itens de cardápio, promoções, mídia e perfis administrativos.
- R2 armazenará novos uploads; D1 armazenará a chave e os metadados.
- O carrinho permanecerá no navegador por ser temporário e específico do dispositivo.
- O site público continuará anônimo. Somente `/admin` iniciará o SIWC.
- Autenticação não será tratada como autorização. Escritas exigirão identidade SIWC e correspondência com um administrador ativo no D1 ou com o allowlist de bootstrap do ambiente.
- O proprietário atual do projeto será incluído no seed administrativo e no allowlist de produção.
- O WhatsApp continuará sendo o fechamento do pedido, usando o número da unidade quando disponível.

## Modelo relacional

`categories 1—N products`, `products N—N locations` por `menu_items`, `promotions` opcionalmente relacionadas a produto e unidade, `media` para objetos R2 e `admins` para autorização.

## Segurança

- Todas as operações administrativas serão revalidadas no servidor.
- Uploads serão limitados a JPEG, PNG e WebP, com tamanho máximo de 5 MB e chaves não controladas pelo cliente.
- SQL usará prepared statements/Drizzle e restrições relacionais.
- O painel não armazenará senhas e não implementará autenticação própria.
