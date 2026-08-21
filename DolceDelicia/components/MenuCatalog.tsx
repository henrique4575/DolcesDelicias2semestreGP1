"use client";

import { useEffect, useMemo, useState } from "react";
import { addItem, buildOrderMessage, cartTotal, emptyCart, parseStoredCart, setItemQuantity } from "@/lib/cart";
import type { CartState, CatalogItem, PublicLocation } from "@/lib/commerce-types";
import { createUnitWhatsAppUrl } from "@/lib/whatsapp";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function MenuCatalog() {
  const [locations, setLocations] = useState<PublicLocation[]>([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [category, setCategory] = useState("todos");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cart, setCart] = useState<CartState>(emptyCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCart(parseStoredCart(localStorage.getItem("dolce-cart-v1")));
      setCustomerName(localStorage.getItem("dolce-customer-name") ?? "");
      const preferred = localStorage.getItem("dolce-selected-location") ?? "";
      fetch("/api/locations")
        .then(async (response) => {
          if (!response.ok) throw new Error("Falha ao carregar unidades");
          return response.json() as Promise<{ locations: PublicLocation[] }>;
        })
        .then((data) => {
          setLocations(data.locations);
          setSelectedSlug(data.locations.some((item) => item.slug === preferred) ? preferred : (data.locations[0]?.slug ?? ""));
        })
        .catch(() => { setError("Não conseguimos carregar as unidades. Tente novamente em instantes."); setLoading(false); });
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!selectedSlug) return;
    const timer = window.setTimeout(() => {
      setLoading(true); setError("");
      localStorage.setItem("dolce-selected-location", selectedSlug);
      fetch(`/api/catalog?location=${encodeURIComponent(selectedSlug)}`)
        .then(async (response) => {
          const body = await response.json() as { items?: CatalogItem[]; error?: string };
          if (!response.ok || !body.items) throw new Error(body.error);
          return body.items;
        })
        .then(setItems)
        .catch(() => setError("Não conseguimos carregar o cardápio desta unidade."))
        .finally(() => setLoading(false));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [selectedSlug]);

  useEffect(() => {
    if (hydrated) localStorage.setItem("dolce-cart-v1", JSON.stringify(cart));
  }, [cart, hydrated]);

  const selectedLocation = locations.find((location) => location.slug === selectedSlug);
  const categories = useMemo(() => Array.from(new Map(items.map((item) => [item.category, item.categoryName])).entries()), [items]);
  const visibleItems = useMemo(() => {
    const needle = query.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    return items.filter((item) => {
      const matchesCategory = category === "todos" || item.category === category;
      const haystack = `${item.name} ${item.description}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      return matchesCategory && (!needle || haystack.includes(needle));
    });
  }, [items, category, query]);
  const cartCount = cart.items.reduce((total, item) => total + item.quantity, 0);

  function chooseLocation(slug: string) {
    if (cart.items.length && cart.location?.slug !== slug) {
      const confirmed = window.confirm("Seu carrinho pertence a outra unidade. Deseja limpá-lo e trocar de unidade?");
      if (!confirmed) return;
      setCart(emptyCart());
    }
    setCategory("todos");
    setSelectedSlug(slug);
  }

  function handleAdd(item: CatalogItem) {
    if (!selectedLocation) return;
    try {
      setCart((current) => addItem(current, selectedLocation, item));
      setCartOpen(true);
    } catch {
      if (window.confirm("Para pedir nesta unidade, precisamos limpar o carrinho anterior. Continuar?")) {
        setCart(addItem(emptyCart(), selectedLocation, item));
        setCartOpen(true);
      }
    }
  }

  function finishOrder() {
    try {
      const message = buildOrderMessage(customerName, cart);
      localStorage.setItem("dolce-customer-name", customerName.trim());
      window.open(createUnitWhatsAppUrl(cart.location?.whatsapp ?? "", message), "_blank", "noopener,noreferrer");
    } catch (caught) {
      setError(caught instanceof Error && caught.message === "CUSTOMER_NAME_REQUIRED" ? "Digite seu nome para finalizar o pedido." : "Adicione pelo menos um item ao carrinho.");
    }
  }

  return (
    <div className="catalog">
      <div className="location-selector">
        <div><span className="eyebrow">1. Escolha onde pedir</span><h2>Cardápio da sua unidade</h2></div>
        <div className="location-pills" role="group" aria-label="Selecione a unidade">
          {locations.map((location) => <button key={location.slug} type="button" aria-pressed={selectedSlug === location.slug} onClick={() => chooseLocation(location.slug)}><strong>{location.name}</strong><small>{location.subtitle}</small></button>)}
        </div>
      </div>

      <div className="catalog-tools">
        <label className="search-field"><span className="sr-only">Buscar no cardápio</span><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar um sabor..." type="search" /></label>
        <div className="filter-row" aria-label="Categorias do cardápio">
          <button type="button" aria-pressed={category === "todos"} onClick={() => setCategory("todos")}>Todos</button>
          {categories.map(([slug, label]) => <button key={slug} type="button" aria-pressed={category === slug} onClick={() => setCategory(slug)}>{label}</button>)}
        </div>
        <button className="cart-trigger" type="button" onClick={() => setCartOpen(true)}>Meu pedido <span>{cartCount}</span></button>
      </div>

      {error && <p className="catalog-alert" role="alert">{error}</p>}
      {loading ? <div className="catalog-loading" aria-live="polite"><span />Preparando o cardápio...</div> : <p className="results-count" aria-live="polite">{visibleItems.length} {visibleItems.length === 1 ? "opção encontrada" : "opções encontradas"}{selectedLocation ? ` em ${selectedLocation.name}` : ""}</p>}

      {!loading && visibleItems.length > 0 && <div className="menu-grid">
        {visibleItems.map((item) => <article className={`product-card${item.available ? "" : " is-unavailable"}`} key={item.id}>
          <div className="product-image-wrap"><img src={item.imageUrl} alt={item.name} width="560" height="410" loading="lazy" />{item.badge && <span className="product-badge">{item.badge}</span>}{!item.available && <span className="unavailable-badge">Indisponível hoje</span>}</div>
          <div className="product-content">
            <div><p className="product-category">{item.categoryName}</p><h2>{item.name}</h2></div><p>{item.description}</p>
            {item.promotion && <p className="promotion-note"><strong>{item.promotion.title}</strong> {item.promotion.description}</p>}
            <div className="product-action"><div>{item.effectivePrice < item.price && <del>{currency.format(item.price)}</del>}<small>{item.effectivePrice < item.price ? "preço promocional" : "preço"}</small><strong>{currency.format(item.effectivePrice)}</strong></div><button disabled={!item.available} type="button" onClick={() => handleAdd(item)}>{item.available ? "Adicionar +" : "Indisponível"}</button></div>
          </div>
        </article>)}
      </div>}

      {!loading && !visibleItems.length && <div className="empty-state"><span aria-hidden="true">✦</span><h2>Esse sabor ainda não apareceu por aqui</h2><p>Tente outra busca ou veja todas as opções do cardápio.</p><button type="button" onClick={() => { setQuery(""); setCategory("todos"); }}>Limpar filtros</button></div>}
      <p className="catalog-disclaimer">Disponibilidade, prazo e total são confirmados pela equipe no WhatsApp. Não há pagamento pelo site.</p>

      {cartOpen && <div className="cart-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false); }}>
        <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
          <header><div><span className="eyebrow">Seu pedido</span><h2 id="cart-title">Carrinho {cart.location ? `— ${cart.location.name}` : ""}</h2></div><button type="button" aria-label="Fechar carrinho" onClick={() => setCartOpen(false)}>×</button></header>
          {cart.items.length ? <>
            <div className="cart-lines">{cart.items.map((line) => <article key={line.id}><img src={line.imageUrl} alt="" width="72" height="72" /><div><strong>{line.name}</strong><span>{currency.format(line.effectivePrice)}</span><div className="quantity"><button type="button" aria-label={`Diminuir ${line.name}`} onClick={() => setCart((current) => setItemQuantity(current, line.id, line.quantity - 1))}>−</button><b>{line.quantity}</b><button type="button" aria-label={`Aumentar ${line.name}`} onClick={() => setCart((current) => setItemQuantity(current, line.id, line.quantity + 1))}>+</button></div></div></article>)}</div>
            <div className="cart-total"><span>Total estimado</span><strong>{currency.format(cartTotal(cart))}</strong></div>
            <label className="field"><span>Seu nome *</span><input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Como podemos chamar você?" /></label>
            <button className="button primary cart-finish" type="button" onClick={finishOrder}>Finalizar no WhatsApp ↗</button>
            <button className="cart-clear" type="button" onClick={() => setCart(emptyCart())}>Limpar carrinho</button>
          </> : <div className="cart-empty"><span>♡</span><h3>Seu carrinho está vazio</h3><p>Escolha uma unidade e adicione seus sabores favoritos.</p><button type="button" onClick={() => setCartOpen(false)}>Ver cardápio</button></div>}
        </aside>
      </div>}
    </div>
  );
}
