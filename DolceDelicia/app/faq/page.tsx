import type { Metadata } from "next";
import { FaqList } from "../../components/FaqList";
import { PageHero } from "../../components/PageHero";
import { createWhatsAppUrl } from "../../lib/whatsapp";

export const metadata: Metadata = { title: "Perguntas frequentes", description: "Respostas sobre pedidos, encomendas, entregas e produtos Dolce Delícia." };

export default function FaqPage() {
  return <><PageHero eyebrow="Estamos aqui para ajudar" title="Perguntas frequentes," accent="respostas diretas." text="Encontre rapidamente informações sobre pedidos, encomendas, produtos, entrega e pagamento." /><section className="section faq-section"><div className="container faq-layout"><aside><p className="eyebrow">Não encontrou?</p><h2>Vamos conversar.</h2><p>Nossa equipe ajuda você a escolher quantidades, sabores e a melhor opção para o seu momento.</p><a className="button" href={createWhatsAppUrl("Olá! Tenho uma dúvida sobre a Dolce Delícia.")} target="_blank" rel="noreferrer">Tirar uma dúvida <span aria-hidden="true">↗</span></a></aside><FaqList /></div></section></>;
}
