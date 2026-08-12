import type { Metadata } from "next";
import { MenuCatalog } from "../../components/MenuCatalog";
import { PageHero } from "../../components/PageHero";

export const metadata: Metadata = { title: "Cardápio", description: "Explore doces, salgados, combos, bebidas e refeições da Dolce Delícia." };

export default function MenuPage() {
  return <><PageHero eyebrow="Doce, salgado ou os dois?" title="Escolha seu favorito" accent="sem pressa." text="Navegue pelos sabores, encontre o que combina com seu momento e fale com a equipe para confirmar seu pedido." /><section className="section catalog-section"><div className="container"><MenuCatalog /></div></section></>;
}
