import type { Metadata } from "next";
import { ContactForm } from "../../components/ContactForm";
import { PageHero } from "../../components/PageHero";
import { locations, socials } from "../../data/site";
import { createWhatsAppUrl } from "../../lib/whatsapp";

export const metadata: Metadata = { title: "Contato", description: "Fale com a Dolce Delícia por WhatsApp, telefone, e-mail ou redes sociais." };

export default function ContactPage() {
  return <><PageHero eyebrow="Adoramos ouvir você" title="Vamos conversar" accent="sobre algo gostoso?" text="Dúvida, encomenda, festa ou apenas um oi — escolha o canal mais confortável e fale com a nossa equipe." /><section className="section contact-section"><div className="container contact-layout"><div className="contact-info"><p className="eyebrow">Fale direto</p><h2>Estamos do outro lado.</h2><div className="contact-methods"><a href={createWhatsAppUrl("Olá! Vim pelo site da Dolce Delícia.")} target="_blank" rel="noreferrer"><span>WhatsApp</span><strong>(45) 99806-4748</strong><i>↗</i></a><a href={socials.email}><span>E-mail</span><strong>chris.colodel@hotmail.com</strong><i>↗</i></a><a href={socials.instagram} target="_blank" rel="noreferrer"><span>Instagram</span><strong>@dolcedeliciasoficial</strong><i>↗</i></a></div><div className="contact-hours"><small>Atendimento</small><p>Segunda a sexta, das 8h às 18h<br />Sábado, das 9h às 14h</p></div></div><ContactForm /></div></section><section className="section contact-units"><div className="container"><div className="section-heading split-heading"><div><p className="eyebrow">Venha nos visitar</p><h2>Encontre seu<br /><em>cantinho Dolce.</em></h2></div><a className="text-link" href="/unidades">Ver todas as unidades →</a></div><div className="mini-unit-grid">{locations.map((location) => <a key={location.id} href={`/unidades#${location.id}`}><span>{location.subtitle}</span><h3>{location.name}</h3><p>{location.address}</p><i>Ver detalhes →</i></a>)}</div></div></section></>;
}
