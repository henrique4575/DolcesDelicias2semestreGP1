import type { CartLine, CartState, CatalogItem, PublicLocation } from "./commerce-types";

export function emptyCart(): CartState {
  return { version: 1, location: null, items: [] };
}

export function addItem(cart: CartState, location: PublicLocation, item: CatalogItem): CartState {
  if (!item.available) return cart;
  if (cart.location && cart.location.slug !== location.slug && cart.items.length) {
    throw new Error("LOCATION_CONFLICT");
  }
  const existing = cart.items.find((line) => line.id === item.id);
  const items = existing
    ? cart.items.map((line) => line.id === item.id ? { ...line, quantity: line.quantity + 1 } : line)
    : [...cart.items, { id: item.id, slug: item.slug, name: item.name, imageUrl: item.imageUrl, effectivePrice: item.effectivePrice, quantity: 1 }];
  return { version: 1, location: { slug: location.slug, name: location.name, whatsapp: location.whatsapp }, items };
}

export function setItemQuantity(cart: CartState, id: number, quantity: number): CartState {
  const items = quantity <= 0
    ? cart.items.filter((line) => line.id !== id)
    : cart.items.map((line) => line.id === id ? { ...line, quantity: Math.min(99, Math.floor(quantity)) } : line);
  return { ...cart, items, location: items.length ? cart.location : null };
}

export function cartTotal(cart: CartState): number {
  return cart.items.reduce((total, item) => total + item.effectivePrice * item.quantity, 0);
}

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function buildOrderMessage(customerName: string, cart: CartState): string {
  const name = customerName.trim();
  if (!name) throw new Error("CUSTOMER_NAME_REQUIRED");
  if (!cart.location || !cart.items.length) throw new Error("EMPTY_CART");
  const lines = cart.items.map((item) => `• ${item.quantity}x ${item.name} — ${currency.format(item.effectivePrice * item.quantity)}`);
  return [
    `Olá! Meu nome é ${name} e gostaria de fazer este pedido na unidade ${cart.location.name}:`,
    "",
    ...lines,
    "",
    `Total estimado: ${currency.format(cartTotal(cart))}`,
    "Por favor, confirme a disponibilidade, o prazo e o valor final.",
  ].join("\n");
}

export function parseStoredCart(value: string | null): CartState {
  if (!value) return emptyCart();
  try {
    const parsed = JSON.parse(value) as CartState;
    if (parsed.version !== 1 || !Array.isArray(parsed.items)) return emptyCart();
    return parsed;
  } catch {
    return emptyCart();
  }
}

export type { CartLine };
