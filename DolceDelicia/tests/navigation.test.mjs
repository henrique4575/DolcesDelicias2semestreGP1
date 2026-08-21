import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("o menu usa navegação HTML nativa para funcionar sem o roteador cliente", async () => {
  const header = await readFile(new URL("../components/SiteHeader.tsx", import.meta.url), "utf8");

  assert.doesNotMatch(header, /from ["']next\/link["']/);
  assert.match(header, /<a className="brand" href="\/"/);
  assert.match(header, /<a href=\{link\.href\}/);
});

test("o cabeçalho permanece fixo e legível durante a rolagem", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.match(css, /\.site-header\s*\{[^}]*position:\s*fixed;/s);
  assert.match(css, /\.site-header\s*\{[^}]*backdrop-filter:\s*blur\(/s);
  assert.match(css, /\.site-header\s*\{[^}]*background:\s*rgba\(/s);
});
