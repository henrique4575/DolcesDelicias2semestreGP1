# Dolce Delícia Complete Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir e publicar um site completo, responsivo e acessível para a Dolce Delícia, com seis rotas, catálogo filtrável e conversão de pedidos por WhatsApp.

**Architecture:** Aplicação vinext/React gerada pelo inicializador oficial do Sites, com rotas no diretório `app`, componentes compartilhados em `components` e conteúdo tipado em `data/site.ts`. Componentes de interação ficam isolados como client components; páginas e conteúdo estático permanecem server-rendered sempre que possível.

**Tech Stack:** TypeScript, React, vinext, CSS global responsivo, Lucide React, Vitest e Sites/Cloudflare Workers.

## Global Constraints

- Seis rotas: `/`, `/sobre`, `/unidades`, `/cardapio`, `/faq` e `/contato`.
- Pedidos e formulário direcionam ao WhatsApp; não há carrinho, checkout, autenticação ou persistência.
- Experiência completa a partir de 320 px, com foco visível, navegação por teclado e suporte a `prefers-reduced-motion`.
- Paleta creme, chocolate, framboesa e dourado suave; estética artesanal premium.
- Não usar ilustrações SVG autorais como decoração.
- Não declarar preços, endereços ou atributos não confirmados como definitivos.

---

## File Map

- `app/layout.tsx`: metadados globais, fontes, cabeçalho e rodapé.
- `app/page.tsx`: página inicial.
- `app/sobre/page.tsx`: história e linha do tempo.
- `app/unidades/page.tsx`: unidades e links de mapa/contato.
- `app/cardapio/page.tsx`: composição da página de catálogo.
- `app/faq/page.tsx`: composição da página de perguntas.
- `app/contato/page.tsx`: canais e formulário.
- `app/globals.css`: tokens, layout, componentes visuais e responsividade.
- `components/SiteHeader.tsx`: navegação desktop e móvel.
- `components/SiteFooter.tsx`: rodapé e redes sociais.
- `components/MenuCatalog.tsx`: busca, filtros e cards de produto.
- `components/FaqList.tsx`: busca e acordeões acessíveis.
- `components/ContactForm.tsx`: validação e montagem da mensagem de WhatsApp.
- `components/WhatsAppButton.tsx`: ação flutuante reutilizável.
- `components/Reveal.tsx`: entrada visual opcional respeitando redução de movimento.
- `data/site.ts`: tipos e conteúdo compartilhado.
- `lib/whatsapp.ts`: construção segura de URLs do WhatsApp.
- `tests/catalog.test.ts`: filtragem de catálogo.
- `tests/whatsapp.test.ts`: codificação das mensagens.
- `public/og.png`: imagem social final validada.

### Task 1: Inicializar a aplicação e fixar a fundação

**Files:**
- Create: `package.json`
- Create: `.openai/hosting.json`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Produces: aplicação vinext executável por `npm run dev` e compilável por `npm run build`.

- [ ] **Step 1: Executar o inicializador oficial do Sites no diretório raiz**

Run: `bash C:/Users/andre/.codex/plugins/cache/openai-bundled/sites/0.1.34/scripts/init-site.sh "$PWD"`

Expected: dependências instaladas, `app/` e `.openai/hosting.json` criados uma única vez.

- [ ] **Step 2: Iniciar a visualização retida**

Run: `npm run dev`

Expected: servidor informa uma Local URL saudável, mantida ativa durante a implementação.

- [ ] **Step 3: Remover a interface provisória e configurar metadados reais**

Use no layout:

```tsx
export const metadata = {
  title: { default: "Dolce Delícia", template: "%s | Dolce Delícia" },
  description: "Doces, salgados e momentos preparados com carinho.",
};
```

Delete `app/_sites-preview` e seus imports; remover `react-loading-skeleton` se não houver outro consumidor.

- [ ] **Step 4: Verificar a fundação**

Run: `npm run build`

Expected: PASS e saída compatível com Cloudflare Workers.

### Task 2: Modelar conteúdo e ações compartilhadas

**Files:**
- Create: `data/site.ts`
- Create: `lib/whatsapp.ts`
- Create: `tests/whatsapp.test.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `MenuItem`, `Location`, `FaqItem`, `menuItems`, `locations`, `faqItems` e `createWhatsAppUrl(message: string): string`.
- Consumes: número público de WhatsApp já presente na referência.

- [ ] **Step 1: Adicionar Vitest e escrever o teste de URL**

```ts
import { describe, expect, it } from "vitest";
import { createWhatsAppUrl } from "../lib/whatsapp";

describe("createWhatsAppUrl", () => {
  it("codifica a mensagem sem perder acentos", () => {
    expect(decodeURIComponent(createWhatsAppUrl("Olá, quero um bolo").split("text=")[1]))
      .toBe("Olá, quero um bolo");
  });
});
```

Run: `npm test`

Expected: FAIL porque `createWhatsAppUrl` ainda não existe.

- [ ] **Step 2: Implementar a função e o conteúdo tipado**

```ts
const WHATSAPP_NUMBER = "";

export function createWhatsAppUrl(message: string) {
  const base = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : "https://tinyurl.com/fk9cjxrn";
  return `${base}${base.includes("?") ? "&" : "?"}text=${encodeURIComponent(message)}`;
}
```

Os registros do catálogo devem ter `id`, `name`, `description`, `category`, `badge?` e `image`; unidades devem distinguir dados confirmados de chamadas genéricas.

- [ ] **Step 3: Executar os testes**

Run: `npm test`

Expected: PASS.

### Task 3: Criar navegação, estrutura global e páginas institucionais

**Files:**
- Create: `components/SiteHeader.tsx`
- Create: `components/SiteFooter.tsx`
- Create: `components/WhatsAppButton.tsx`
- Create: `components/Reveal.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Create: `app/sobre/page.tsx`
- Create: `app/unidades/page.tsx`

**Interfaces:**
- Consumes: `locations` e `createWhatsAppUrl`.
- Produces: shell compartilhado com links acessíveis e páginas institucionais completas.

- [ ] **Step 1: Implementar o cabeçalho responsivo**

O botão móvel usa `aria-expanded`, `aria-controls="primary-navigation"` e fecha por Escape, clique em link ou botão de fechar. O link da rota atual recebe `aria-current="page"`.

- [ ] **Step 2: Implementar rodapé e ação flutuante**

Manter Instagram, Facebook e WhatsApp da referência, além dos links das seis rotas. O botão flutuante recebe `aria-label="Fazer pedido pelo WhatsApp"`.

- [ ] **Step 3: Implementar a Home**

Incluir hero com proposta específica, categorias, produtos em destaque, resumo da história, três unidades, depoimentos editoriais e CTA final. Todo texto deve falar de confeitaria, cantina e encomendas, sem frases genéricas de template.

- [ ] **Step 4: Implementar Sobre e Unidades**

Sobre apresenta história, missão, visão, valores e linha do tempo 2018–2026. Unidades apresenta Biopark, Matriz e Filial com CTA para localização/contato, sem inventar endereço quando a fonte não o confirmar.

- [ ] **Step 5: Verificar rotas institucionais**

Run: `npm run build`

Expected: `/`, `/sobre` e `/unidades` são compiladas sem erro.

### Task 4: Implementar catálogo, FAQ e contato

**Files:**
- Create: `components/MenuCatalog.tsx`
- Create: `components/FaqList.tsx`
- Create: `components/ContactForm.tsx`
- Create: `tests/catalog.test.ts`
- Create: `lib/catalog.ts`
- Create: `app/cardapio/page.tsx`
- Create: `app/faq/page.tsx`
- Create: `app/contato/page.tsx`

**Interfaces:**
- Consumes: `menuItems`, `faqItems`, `createWhatsAppUrl`.
- Produces: `filterMenu(items, category, query): MenuItem[]` e três rotas interativas.

- [ ] **Step 1: Escrever teste de filtragem**

```ts
import { expect, it } from "vitest";
import { filterMenu } from "../lib/catalog";

it("combina categoria e busca sem diferenciar maiúsculas", () => {
  const items = [{ id: "1", name: "Brigadeiro", description: "Chocolate", category: "doces", image: "/menu/brigadeiro.jpg" }];
  expect(filterMenu(items, "doces", "BRIGA")).toHaveLength(1);
  expect(filterMenu(items, "bebidas", "BRIGA")).toHaveLength(0);
});
```

Run: `npm test`

Expected: FAIL porque `filterMenu` ainda não existe.

- [ ] **Step 2: Implementar catálogo e filtros**

Normalizar busca com `toLocaleLowerCase("pt-BR")`; botões de categoria usam estado pressionado acessível. Estado vazio oferece limpar filtros. Cada card prepara mensagem com o nome do produto.

- [ ] **Step 3: Implementar FAQ e contato**

FAQ usa `<details>`/`<summary>` para funcionalidade nativa e busca textual. Contato valida nome, canal de retorno e mensagem antes de abrir o WhatsApp; erros ficam associados aos campos por `aria-describedby`.

- [ ] **Step 4: Executar testes e compilação**

Run: `npm test && npm run build`

Expected: testes passam e as seis rotas são compiladas.

### Task 5: Aplicar identidade visual, mídia e acabamento acessível

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Create: `public/og.png`
- Create: arquivos de imagem sob `public/images/`

**Interfaces:**
- Consumes: classes e estrutura das Tasks 3 e 4.
- Produces: identidade visual responsiva final e metadados sociais.

- [ ] **Step 1: Implementar tokens e composição responsiva**

Definir variáveis para creme, chocolate, framboesa, dourado, superfícies, raios e sombras. Usar `clamp()` para tipografia e espaçamento; incluir breakpoints para navegação, grids e hero.

- [ ] **Step 2: Adicionar imagens relevantes**

Selecionar fotografias licenciadas por busca de imagens quando necessário; copiar apenas arquivos permitidos para `public/images`. Todas as imagens de conteúdo recebem `alt` específico e dimensões estáveis.

- [ ] **Step 3: Tratar movimento, foco e contraste**

```css
:focus-visible { outline: 3px solid var(--color-focus); outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; }
}
```

- [ ] **Step 4: Gerar e inspecionar uma única imagem social**

Gerar uma composição horizontal coerente com a Home, verificar visualmente o texto e salvar como `public/og.png`. Se o texto estiver incorreto, repetir no máximo uma vez; se continuar inválido, omitir `og:image`.

- [ ] **Step 5: Executar validação final**

Run: `npm test && npm run build`

Expected: PASS sem erros de TypeScript, testes ou geração das rotas.

### Task 6: Publicar a versão validada

**Files:**
- Modify: `.openai/hosting.json`

**Interfaces:**
- Consumes: build final imutável e metadados de hospedagem.
- Produces: URL privada do Sites.

- [ ] **Step 1: Criar ou reutilizar o projeto Sites**

Persistir apenas `project_id` e bindings lógicos permitidos em `.openai/hosting.json`.

- [ ] **Step 2: Salvar a fonte validada e empacotar a saída**

Usar o helper `scripts/package-site.sh`, garantindo `dist/server/index.js`, assets estáticos e metadados de hospedagem.

- [ ] **Step 3: Publicar privadamente e aguardar conclusão**

Criar uma versão, iniciar implantação privada e acompanhar até `status: succeeded`.

- [ ] **Step 4: Abrir o endereço publicado**

Abrir a URL devolvida pela implantação no navegador integrado e entregar esse endereço como resultado principal.
