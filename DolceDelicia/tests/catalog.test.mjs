import assert from "node:assert/strict";
import test from "node:test";
import { filterMenu } from "../lib/catalog.ts";

const items = [
  {
    id: "brigadeiro",
    name: "Brigadeiro artesanal",
    description: "Chocolate e granulado",
    category: "doces",
    image: "/images/menu/brigadeiro.jpg",
  },
  {
    id: "cafe",
    name: "Café expresso",
    description: "Café intenso",
    category: "bebidas",
    image: "/images/menu/cafe.jpg",
  },
];

test("combina categoria e busca ignorando maiúsculas", () => {
  assert.deepEqual(filterMenu(items, "doces", "BRIGA"), [items[0]]);
  assert.deepEqual(filterMenu(items, "bebidas", "BRIGA"), []);
});

test("busca também na descrição e remove acentos", () => {
  assert.deepEqual(filterMenu(items, "todos", "CAFE"), [items[1]]);
  assert.deepEqual(filterMenu(items, "todos", "chocolate"), [items[0]]);
});

test("retorna todos os itens quando os filtros estão vazios", () => {
  assert.deepEqual(filterMenu(items, "todos", ""), items);
});
