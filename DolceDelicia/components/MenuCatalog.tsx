"use client";

import { useMemo, useState } from "react";
import { menuItems, type MenuCategory } from "../data/site";
import { filterMenu } from "../lib/catalog";
import { createWhatsAppUrl } from "../lib/whatsapp";

const categories: { value: "todos" | MenuCategory; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "doces", label: "Doces" },
  { value: "salgados", label: "Salgados" },
  { value: "combos", label: "Combos" },
  { value: "bebidas", label: "Bebidas" },
  { value: "refeicoes", label: "Refeições" },
];

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function MenuCatalog() {
  const [category, setCategory] = useState<"todos" | MenuCategory>("todos");
  const [query, setQuery] = useState("");
  const visibleItems = useMemo(() => filterMenu(menuItems, category, query), [category, query]);

  return (
    <div className="catalog">
      <div className="catalog-tools">
        <label className="search-field">
          <span className="sr-only">Buscar no cardápio</span>
          <span aria-hidden="true">⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar um sabor..." type="search" />
        </label>
        <div className="filter-row" aria-label="Categorias do cardápio">
          {categories.map((item) => (
            <button key={item.value} type="button" aria-pressed={category === item.value} onClick={() => setCategory(item.value)}>{item.label}</button>
          ))}
        </div>
      </div>

      <p className="results-count" aria-live="polite">{visibleItems.length} {visibleItems.length === 1 ? "opção encontrada" : "opções encontradas"}</p>

      {visibleItems.length ? (
        <div className="menu-grid">
          {visibleItems.map((item) => (
            <article className="product-card" key={item.id}>
              <div className="product-image-wrap">
                <img src={item.image} alt={item.name} width="560" height="410" loading="lazy" />
                {item.badge && <span className="product-badge">{item.badge}</span>}
              </div>
              <div className="product-content">
                <div><p className="product-category">{categories.find((entry) => entry.value === item.category)?.label}</p><h2>{item.name}</h2></div>
                <p>{item.description}</p>
                <div className="product-action">
                  <div><small>a partir de</small><strong>{currency.format(item.price)}</strong></div>
                  <a href={createWhatsAppUrl(`Olá! Gostaria de pedir ${item.name}. Pode me passar mais informações?`)} target="_blank" rel="noreferrer" aria-label={`Pedir ${item.name} pelo WhatsApp`}>Pedir <span aria-hidden="true">↗</span></a>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span aria-hidden="true">✦</span>
          <h2>Esse sabor ainda não apareceu por aqui</h2>
          <p>Tente outra busca ou veja todas as opções do cardápio.</p>
          <button type="button" onClick={() => { setQuery(""); setCategory("todos"); }}>Limpar filtros</button>
        </div>
      )}
      <p className="catalog-disclaimer">Os valores são referências do cardápio publicado e podem mudar. Confirme disponibilidade e total no atendimento.</p>
    </div>
  );
}
