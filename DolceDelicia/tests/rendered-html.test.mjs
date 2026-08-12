import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

for (const [pathname, marker] of [
  ["/", "Feito para[\\s\\S]*celebrar"],
  ["/sobre", "Nossa história"],
  ["/unidades", "Onde encontrar"],
  ["/cardapio", "Escolha seu favorito"],
  ["/faq", "Perguntas frequentes"],
  ["/contato", "Vamos conversar"],
]) {
  test(`renderiza ${pathname} com conteúdo específico`, async () => {
    const response = await render(pathname);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
    assert.match(await response.text(), new RegExp(marker, "i"));
  });
}

test("a home expõe metadados reais e remove a prévia provisória", async () => {
  const response = await render("/");
  const html = await response.text();

  assert.match(html, /<title>Dolce Delícia(?: \| Dolce Delícia)?<\/title>/i);
  assert.doesNotMatch(html, /codex-preview|Building your site|react-loading-skeleton/i);
  assert.match(html, /lang="pt-BR"/i);
});
