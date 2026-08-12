import type { Metadata } from "next";
import { PageHero } from "../../components/PageHero";
import { locations } from "../../data/site";
import { createWhatsAppUrl } from "../../lib/whatsapp";

export const metadata: Metadata = { title: "Unidades", description: "Encontre as unidades Dolce Delícia em Toledo, Paraná." };

export default function LocationsPage() {
  return (
    <>
      <PageHero eyebrow="Toledo — Paraná" title="Onde encontrar" accent="a Dolce." text="Três endereços, a mesma receita de acolhimento. Escolha a unidade mais próxima e venha viver um momento gostoso." />
      <section className="section units-page"><div className="container unit-list">{locations.map((location, index) => <article className="unit-feature" id={location.id} key={location.id}><div className="unit-image"><img src={location.image} alt={`Fachada ou ambiente da unidade ${location.name}`} width="840" height="610" /><span>0{index + 1}</span></div><div className="unit-copy"><p className="eyebrow">{location.subtitle}</p><h2>{location.name}</h2><div className="unit-meta"><div><small>Endereço</small><address>{location.address}</address></div><div><small>Horário</small><p>{location.hours}</p></div><div><small>Contato</small><a href="tel:+5545998064748">(45) 99806-4748</a></div></div><div className="button-row"><a className="button" href={location.mapsUrl} target="_blank" rel="noreferrer">Abrir no mapa <span aria-hidden="true">↗</span></a><a className="text-link" href={createWhatsAppUrl(`Olá! Gostaria de falar sobre a unidade ${location.name}.`)} target="_blank" rel="noreferrer">Falar com a unidade →</a></div></div></article>)}</div></section>
      <section className="final-cta"><div className="container"><p className="eyebrow light">Prefere pedir de casa?</p><h2>A Dolce também pode<br /><em>chegar até você.</em></h2><a className="button button-light" href={createWhatsAppUrl("Olá! Gostaria de consultar entrega para o meu endereço.")} target="_blank" rel="noreferrer">Consultar entrega <span aria-hidden="true">↗</span></a></div></section>
    </>
  );
}
