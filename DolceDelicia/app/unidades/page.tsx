import type { Metadata } from "next";
import { LocationsDirectory } from "@/components/LocationsDirectory";
import { PageHero } from "@/components/PageHero";
import { createWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Unidades", description: "Encontre as unidades Dolce Delícia em Toledo, Paraná." };

export default function LocationsPage() {
  return <>
    <PageHero eyebrow="Toledo — Paraná" title="Onde encontrar" accent="a Dolce." text="Três endereços, a mesma receita de acolhimento. Escolha a unidade mais próxima e venha viver um momento gostoso." />
    <section className="section units-page"><LocationsDirectory /></section>
    <section className="final-cta"><div className="container"><p className="eyebrow light">Prefere pedir de casa?</p><h2>A Dolce também pode<br /><em>chegar até você.</em></h2><a className="button button-light" href={createWhatsAppUrl("Olá! Gostaria de consultar entrega para o meu endereço.")} target="_blank" rel="noreferrer">Consultar entrega <span aria-hidden="true">↗</span></a></div></section>
  </>;
}
