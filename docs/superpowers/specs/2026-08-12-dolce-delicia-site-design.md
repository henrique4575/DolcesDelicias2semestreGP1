# Dolce Delícia — Especificação de Design

## Objetivo

Criar um site completo para a Dolce Delícia, inspirado na estrutura do site de referência, mas com identidade visual mais sofisticada, melhor hierarquia de conteúdo, navegação responsiva e caminhos claros para pedidos via WhatsApp.

## Público e resultado esperado

O site atende clientes que desejam conhecer a marca, consultar produtos, localizar uma unidade e fazer pedidos. O resultado principal é transformar visitas em conversas de pedido pelo WhatsApp, sem introduzir carrinho, conta ou checkout nesta versão.

## Direção visual

- Estética de confeitaria artesanal premium, acolhedora e contemporânea.
- Paleta baseada em creme, chocolate, framboesa e dourado suave.
- Tipografia expressiva em títulos, combinada a uma fonte de leitura limpa.
- Fotografias de produtos com destaque, cartões arredondados e composição editorial.
- Animações discretas que respeitam `prefers-reduced-motion`.
- Interface autoral, sem aparência de template genérico e sem ilustrações SVG produzidas para decoração.

## Arquitetura de informação

O site terá seis rotas principais:

1. **Home:** apresentação da marca, categorias, produtos em destaque, história resumida, unidades, depoimentos e chamadas para pedido.
2. **Sobre Nós:** história, missão, visão, valores e linha do tempo de 2018 a 2026.
3. **Unidades:** Biopark, Matriz e Filial, com endereço, horário, serviços, contato e acesso ao mapa.
4. **Cardápio:** catálogo pesquisável e filtrável por doces, salgados, combos e bebidas; cada item permite iniciar um pedido no WhatsApp.
5. **FAQ:** perguntas expansíveis organizadas por assunto e busca textual no conteúdo.
6. **Contato:** canais de atendimento, horários, unidades e formulário que prepara uma mensagem para o WhatsApp.

Todas as rotas compartilham cabeçalho, navegação móvel, rodapé, botão flutuante do WhatsApp e linguagem visual consistente.

## Conteúdo e comportamento

- O conteúdo existente da marca será preservado quando disponível e reescrito apenas para clareza e impacto.
- O catálogo usará dados realistas e específicos, sem alegar preços, endereços ou atributos não confirmados como fatos definitivos.
- Links de redes sociais existentes serão mantidos.
- Ações de pedido abrirão o WhatsApp com uma mensagem contextual pronta.
- O formulário de contato validará os campos no navegador e não armazenará dados.
- Filtros, busca, menu móvel e acordeões funcionarão por teclado e toque.
- Estados vazios e mensagens de validação serão claros e orientados à ação.

## Responsividade e acessibilidade

- Experiência completa a partir de 320 px de largura.
- Ordem de leitura semântica, foco visível, contraste adequado e rótulos acessíveis.
- Imagens terão texto alternativo; ícones interativos terão nomes acessíveis.
- A navegação móvel bloqueará corretamente o fundo e poderá ser fechada por botão, seleção ou tecla Escape.
- O conteúdo essencial continuará utilizável sem animações.

## Metadados e compartilhamento

Cada rota terá título e descrição próprios. O site terá uma imagem social exclusiva alinhada à identidade final, usada somente após inspeção visual de texto e composição.

## Limites desta versão

- Sem carrinho, pagamento, autenticação ou persistência de pedidos.
- Sem painel administrativo ou integração com estoque.
- Sem publicação automática de posts do Instagram.
- Sem alegar integração ativa com serviços que não estejam configurados.

## Validação

- Compilação de produção concluída sem erros.
- Todas as seis rotas disponíveis e navegáveis.
- Interações essenciais cobertas por testes automatizados adequados ao projeto.
- Revisão estrutural de acessibilidade e comportamento responsivo.
- Publicação privada pelo Sites após a validação local.
