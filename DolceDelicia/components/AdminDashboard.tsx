"use client";

import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from "react";

type Row = Record<string, string | number | null>;
type Dataset = { categories: Row[]; products: Row[]; locations: Row[]; menuItems: Row[]; promotions: Row[]; media: Row[] };
type Tab = "overview" | "products" | "categories" | "locations" | "menu" | "promotions" | "media";
type Mutation = (resource: string, action: string, data: Record<string, unknown>) => Promise<boolean>;

const emptyData: Dataset = { categories: [], products: [], locations: [], menuItems: [], promotions: [], media: [] };
const tabs: { id: Tab; label: string }[] = [
  { id: "overview", label: "Visão geral" }, { id: "products", label: "Produtos" }, { id: "categories", label: "Categorias" },
  { id: "locations", label: "Unidades" }, { id: "menu", label: "Preços e disponibilidade" }, { id: "promotions", label: "Promoções" }, { id: "media", label: "Imagens" },
];

export function AdminDashboard({ identity, signOutPath }: { identity: { name: string; email: string; role: string }; signOutPath: string }) {
  const [active, setActive] = useState<Tab>("overview");
  const [data, setData] = useState<Dataset>(emptyData);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/catalog", { cache: "no-store" });
      const body = await response.json() as Dataset & { error?: string };
      if (!response.ok) throw new Error(body.error);
      setData(body);
    } catch (error) { setNotice(error instanceof Error ? error.message : "Não foi possível carregar os dados."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const mutate: Mutation = async (resource, action, mutationData) => {
    setNotice("Salvando...");
    try {
      const response = await fetch("/api/admin/catalog", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ resource, action, data: mutationData }) });
      const body = await response.json() as { error?: string };
      if (!response.ok) throw new Error(body.error);
      setNotice("Alterações salvas com sucesso.");
      await load();
      return true;
    } catch (error) { setNotice(error instanceof Error ? error.message : "Não foi possível salvar."); return false; }
  };

  return <div className="admin-shell">
    <aside className="admin-sidebar"><a className="admin-brand" href="/"><img src="/images/logo.png" width="54" height="54" alt="" /><span>Dolce Delícia<small>Administração</small></span></a><nav>{tabs.map((tab) => <button className={active === tab.id ? "active" : ""} key={tab.id} onClick={() => setActive(tab.id)}>{tab.label}</button>)}</nav><div className="admin-account"><span>{identity.name}</span><small>{identity.email} · {identity.role}</small><a href={signOutPath}>Sair da conta</a></div></aside>
    <section className="admin-main"><header><div><span className="eyebrow">Painel comercial</span><h1>{tabs.find((tab) => tab.id === active)?.label}</h1></div><a className="button ghost" href="/cardapio" target="_blank">Ver site ↗</a></header>{notice && <p className="admin-notice" role="status">{notice}</p>}{loading ? <p className="admin-loading">Carregando dados...</p> : <AdminContent active={active} data={data} mutate={mutate} onNotice={setNotice} onReload={load} />}</section>
  </div>;
}

function AdminContent({ active, data, mutate, onNotice, onReload }: { active: Tab; data: Dataset; mutate: Mutation; onNotice: (value: string) => void; onReload: () => Promise<void> }) {
  if (active === "overview") return <div className="admin-overview"><div className="stat-grid"><Stat label="Produtos" value={data.products.length} /><Stat label="Unidades" value={data.locations.length} /><Stat label="Itens nos cardápios" value={data.menuItems.length} /><Stat label="Promoções" value={data.promotions.filter((row) => row.active).length} /></div><section className="admin-panel"><h2>Operação em um só lugar</h2><p>Use o menu lateral para cadastrar produtos e unidades, ajustar preços e disponibilidade por loja, programar promoções e enviar novas imagens. As mudanças aparecem no cardápio público assim que forem salvas.</p></section></div>;
  if (active === "products") return <Products data={data} mutate={mutate} />;
  if (active === "categories") return <Categories data={data} mutate={mutate} />;
  if (active === "locations") return <Locations data={data} mutate={mutate} />;
  if (active === "menu") return <MenuItems data={data} mutate={mutate} />;
  if (active === "promotions") return <Promotions data={data} mutate={mutate} />;
  return <Media data={data} onNotice={onNotice} onReload={onReload} />;
}

function Stat({ label, value }: { label: string; value: number }) { return <article className="admin-stat"><strong>{value}</strong><span>{label}</span></article>; }
function Panel({ title, children }: { title: string; children: ReactNode }) { return <section className="admin-panel"><h2>{title}</h2>{children}</section>; }
function Field({ label, children, wide = false }: { label: string; children: ReactNode; wide?: boolean }) { return <label className={`admin-field${wide ? " wide" : ""}`}><span>{label}</span>{children}</label>; }
function Active({ value, onChange, label = "Ativo" }: { value: boolean; onChange: (value: boolean) => void; label?: string }) { return <label className="admin-check"><input type="checkbox" checked={value} onChange={(event) => onChange(event.target.checked)} /> {label}</label>; }
function Actions({ onNew }: { onNew: () => void }) { return <button className="admin-new" type="button" onClick={onNew}>+ Novo cadastro</button>; }
function Status({ active }: { active: unknown }) { return <span className={`admin-status ${active ? "on" : "off"}`}>{active ? "Ativo" : "Inativo"}</span>; }

function Products({ data, mutate }: { data: Dataset; mutate: Mutation }) {
  const initial = { id: "", name: "", slug: "", description: "", imageUrl: "", categoryId: String(data.categories[0]?.id ?? ""), active: true };
  const [form, setForm] = useState(initial); const set = (key: string, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));
  const edit = (row: Row) => setForm({ id: String(row.id), name: String(row.name), slug: String(row.slug), description: String(row.description), imageUrl: String(row.image_url), categoryId: String(row.category_id), active: Boolean(row.active) });
  async function submit(event: FormEvent) { event.preventDefault(); if (await mutate("product", "save", form)) setForm(initial); }
  return <div className="admin-columns"><Panel title={form.id ? "Editar produto" : "Novo produto"}><form className="admin-form" onSubmit={submit}><Field label="Nome"><input required value={form.name} onChange={(e) => set("name", e.target.value)} /></Field><Field label="Slug"><input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="gerado pelo nome" /></Field><Field label="Categoria"><select required value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)}>{data.categories.map((row) => <option key={row.id} value={row.id ?? ""}>{row.name}</option>)}</select></Field><Field label="URL da imagem" wide><input required value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} placeholder="/images/... ou /api/media/..." /></Field><Field label="Descrição" wide><textarea required rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} /></Field><Active value={form.active} onChange={(value) => set("active", value)} /><div className="admin-form-actions"><button className="button primary">Salvar produto</button>{form.id && <button type="button" onClick={() => setForm(initial)}>Cancelar</button>}</div></form></Panel><Panel title="Produtos cadastrados"><Actions onNew={() => setForm(initial)} /><div className="admin-table">{data.products.map((row) => <button key={row.id} onClick={() => edit(row)}><img src={String(row.image_url)} alt="" /><span><strong>{row.name}</strong><small>{row.category_name}</small></span><Status active={row.active} /></button>)}</div></Panel></div>;
}

function Categories({ data, mutate }: { data: Dataset; mutate: Mutation }) {
  const initial = { id: "", name: "", slug: "", description: "", sortOrder: "0", active: true }; const [form, setForm] = useState(initial); const set = (key: string, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));
  return <div className="admin-columns"><Panel title={form.id ? "Editar categoria" : "Nova categoria"}><form className="admin-form" onSubmit={async (e) => { e.preventDefault(); if (await mutate("category", "save", form)) setForm(initial); }}><Field label="Nome"><input required value={form.name} onChange={(e) => set("name", e.target.value)} /></Field><Field label="Slug"><input value={form.slug} onChange={(e) => set("slug", e.target.value)} /></Field><Field label="Ordem"><input type="number" value={form.sortOrder} onChange={(e) => set("sortOrder", e.target.value)} /></Field><Field label="Descrição" wide><textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} /></Field><Active value={form.active} onChange={(v) => set("active", v)} /><div className="admin-form-actions"><button className="button primary">Salvar categoria</button>{form.id && <button type="button" onClick={() => setForm(initial)}>Cancelar</button>}</div></form></Panel><Panel title="Categorias"><div className="admin-table simple">{data.categories.map((row) => <button key={row.id} onClick={() => setForm({ id: String(row.id), name: String(row.name), slug: String(row.slug), description: String(row.description ?? ""), sortOrder: String(row.sort_order), active: Boolean(row.active) })}><span><strong>{row.name}</strong><small>{row.description}</small></span><Status active={row.active} /></button>)}</div></Panel></div>;
}

function Locations({ data, mutate }: { data: Dataset; mutate: Mutation }) {
  const initial = { id: "", name: "", slug: "", subtitle: "", address: "", contact: "", whatsapp: "", hours: "", imageUrl: "", mapsUrl: "", sortOrder: "0", active: true }; const [form, setForm] = useState(initial); const set = (key: string, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));
  const edit = (r: Row) => setForm({ id: String(r.id), name: String(r.name), slug: String(r.slug), subtitle: String(r.subtitle), address: String(r.address), contact: String(r.contact), whatsapp: String(r.whatsapp), hours: String(r.hours), imageUrl: String(r.image_url), mapsUrl: String(r.maps_url), sortOrder: String(r.sort_order), active: Boolean(r.active) });
  return <div className="admin-columns"><Panel title={form.id ? "Editar unidade" : "Nova unidade"}><form className="admin-form" onSubmit={async (e) => { e.preventDefault(); if (await mutate("location", "save", form)) setForm(initial); }}><Field label="Nome"><input required value={form.name} onChange={(e) => set("name", e.target.value)} /></Field><Field label="Identificador"><input value={form.slug} onChange={(e) => set("slug", e.target.value)} /></Field><Field label="Subtítulo"><input required value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} /></Field><Field label="Ordem"><input type="number" value={form.sortOrder} onChange={(e) => set("sortOrder", e.target.value)} /></Field><Field label="Endereço" wide><input required value={form.address} onChange={(e) => set("address", e.target.value)} /></Field><Field label="Telefone"><input required value={form.contact} onChange={(e) => set("contact", e.target.value)} /></Field><Field label="WhatsApp (com DDI)"><input required value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} /></Field><Field label="Horário" wide><input required value={form.hours} onChange={(e) => set("hours", e.target.value)} /></Field><Field label="URL da imagem" wide><input required value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} /></Field><Field label="Link do Google Maps" wide><input required type="url" value={form.mapsUrl} onChange={(e) => set("mapsUrl", e.target.value)} /></Field><Active value={form.active} onChange={(v) => set("active", v)} /><div className="admin-form-actions"><button className="button primary">Salvar unidade</button>{form.id && <button type="button" onClick={() => setForm(initial)}>Cancelar</button>}</div></form></Panel><Panel title="Unidades"><div className="admin-table">{data.locations.map((r) => <button key={r.id} onClick={() => edit(r)}><img src={String(r.image_url)} alt="" /><span><strong>{r.name}</strong><small>{r.address}</small></span><Status active={r.active} /></button>)}</div></Panel></div>;
}

function MenuItems({ data, mutate }: { data: Dataset; mutate: Mutation }) {
  const initial = { id: "", productId: String(data.products[0]?.id ?? ""), locationId: String(data.locations[0]?.id ?? ""), price: "", badge: "", available: true, active: true }; const [form, setForm] = useState(initial); const set = (key: string, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));
  const edit = (r: Row) => setForm({ id: String(r.id), productId: String(r.product_id), locationId: String(r.location_id), price: String(r.price), badge: String(r.badge ?? ""), available: Boolean(r.available), active: Boolean(r.active) });
  return <div className="admin-columns"><Panel title={form.id ? "Editar item do cardápio" : "Adicionar à unidade"}><form className="admin-form" onSubmit={async (e) => { e.preventDefault(); if (await mutate("menuItem", "save", form)) setForm(initial); }}><Field label="Produto"><select value={form.productId} onChange={(e) => set("productId", e.target.value)}>{data.products.map((r) => <option value={r.id ?? ""} key={r.id}>{r.name}</option>)}</select></Field><Field label="Unidade"><select value={form.locationId} onChange={(e) => set("locationId", e.target.value)}>{data.locations.map((r) => <option value={r.id ?? ""} key={r.id}>{r.name}</option>)}</select></Field><Field label="Preço (R$)"><input required min="0" step="0.01" type="number" value={form.price} onChange={(e) => set("price", e.target.value)} /></Field><Field label="Selo"><input value={form.badge} onChange={(e) => set("badge", e.target.value)} placeholder="Ex.: Queridinho" /></Field><Active value={form.available} onChange={(v) => set("available", v)} label="Disponível para pedidos" /><Active value={form.active} onChange={(v) => set("active", v)} /><div className="admin-form-actions"><button className="button primary">Salvar no cardápio</button>{form.id && <button type="button" onClick={() => setForm(initial)}>Cancelar</button>}</div></form></Panel><Panel title="Cardápios por unidade"><div className="admin-table simple">{data.menuItems.map((r) => <button key={r.id} onClick={() => edit(r)}><span><strong>{r.product_name}</strong><small>{r.location_name} · R$ {Number(r.price).toFixed(2).replace(".", ",")}</small></span><Status active={r.active && r.available} /></button>)}</div></Panel></div>;
}

function Promotions({ data, mutate }: { data: Dataset; mutate: Mutation }) {
  const initial = { id: "", title: "", description: "", imageUrl: "", productId: String(data.products[0]?.id ?? ""), locationId: "", promotionalPrice: "", startsAt: "", endsAt: "", active: true }; const [form, setForm] = useState(initial); const set = (key: string, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));
  const edit = (r: Row) => setForm({ id: String(r.id), title: String(r.title), description: String(r.description), imageUrl: String(r.image_url ?? ""), productId: String(r.product_id), locationId: String(r.location_id ?? ""), promotionalPrice: String(r.promotional_price), startsAt: String(r.starts_at).slice(0, 16), endsAt: String(r.ends_at).slice(0, 16), active: Boolean(r.active) });
  return <div className="admin-columns"><Panel title={form.id ? "Editar promoção" : "Nova promoção"}><form className="admin-form" onSubmit={async (e) => { e.preventDefault(); if (await mutate("promotion", "save", form)) setForm(initial); }}><Field label="Título"><input required value={form.title} onChange={(e) => set("title", e.target.value)} /></Field><Field label="Produto"><select value={form.productId} onChange={(e) => set("productId", e.target.value)}>{data.products.map((r) => <option value={r.id ?? ""} key={r.id}>{r.name}</option>)}</select></Field><Field label="Unidade"><select value={form.locationId} onChange={(e) => set("locationId", e.target.value)}><option value="">Todas as unidades</option>{data.locations.map((r) => <option value={r.id ?? ""} key={r.id}>{r.name}</option>)}</select></Field><Field label="Preço promocional"><input required min="0" step="0.01" type="number" value={form.promotionalPrice} onChange={(e) => set("promotionalPrice", e.target.value)} /></Field><Field label="Início"><input required type="datetime-local" value={form.startsAt} onChange={(e) => set("startsAt", e.target.value)} /></Field><Field label="Término"><input required type="datetime-local" value={form.endsAt} onChange={(e) => set("endsAt", e.target.value)} /></Field><Field label="Descrição" wide><textarea required rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} /></Field><Field label="URL da imagem (opcional)" wide><input value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} /></Field><Active value={form.active} onChange={(v) => set("active", v)} /><div className="admin-form-actions"><button className="button primary">Salvar promoção</button>{form.id && <button type="button" onClick={() => setForm(initial)}>Cancelar</button>}</div></form></Panel><Panel title="Promoções programadas"><div className="admin-table simple">{data.promotions.map((r) => <button key={r.id} onClick={() => edit(r)}><span><strong>{r.title}</strong><small>{r.product_name} · {r.location_name ?? "Todas as unidades"} · R$ {Number(r.promotional_price).toFixed(2).replace(".", ",")}</small></span><Status active={r.active} /></button>)}</div></Panel></div>;
}

function Media({ data, onNotice, onReload }: { data: Dataset; onNotice: (value: string) => void; onReload: () => Promise<void> }) {
  const [uploading, setUploading] = useState(false); const [lastUrl, setLastUrl] = useState("");
  async function upload(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const input = event.currentTarget.elements.namedItem("file") as HTMLInputElement; if (!input.files?.[0]) return; setUploading(true); const form = new FormData(); form.set("file", input.files[0]); try { const response = await fetch("/api/admin/media", { method: "POST", body: form }); const body = await response.json() as { error?: string; url?: string }; if (!response.ok || !body.url) throw new Error(body.error); setLastUrl(body.url); onNotice("Imagem enviada. Copie a URL para usar em produtos, unidades ou promoções."); await onReload(); input.value = ""; } catch (error) { onNotice(error instanceof Error ? error.message : "Falha no upload."); } finally { setUploading(false); } }
  return <div className="admin-columns"><Panel title="Enviar imagem"><form className="admin-upload" onSubmit={upload}><p>Formatos aceitos: JPG, PNG, WebP ou AVIF, com até 5 MB.</p><input required name="file" type="file" accept="image/jpeg,image/png,image/webp,image/avif" /><button className="button primary" disabled={uploading}>{uploading ? "Enviando..." : "Enviar imagem"}</button>{lastUrl && <label><span>URL pronta para uso</span><input readOnly value={lastUrl} onFocus={(e) => e.currentTarget.select()} /></label>}</form></Panel><Panel title="Biblioteca recente"><div className="media-grid">{data.media.map((r) => <figure key={r.id}><img src={`/api/media/${r.object_key}`} alt={String(r.filename)} /><figcaption><strong>{r.filename}</strong><input readOnly value={`/api/media/${r.object_key}`} onFocus={(e) => e.currentTarget.select()} /></figcaption></figure>)}</div></Panel></div>;
}
