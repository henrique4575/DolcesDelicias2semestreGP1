import type { Metadata } from "next";
import { PageHero } from "../../components/PageHero";
import { timeline } from "../../data/site";
import { createWhatsAppUrl } from "../../lib/whatsapp";

export const metadata: Metadata = { title: "Sobre nós", description: "Conheça a história, a missão e os valores da Dolce Delícia." };

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="O sabor de acreditar" title="Nossa história começou" accent="com coragem." text="Uma cozinha de casa, receitas de família e a vontade de construir algo bonito. É dessa mistura que a Dolce Delícia nasceu." />
      <section className="section about-intro"><div className="container story-grid"><div className="story-images"><img className="story-main" src="/images/about.jpg" alt="História da Dolce Delícia" width="720" height="850" /><span className="stamp stamp-light">Receitas<br /><strong>com afeto</strong><br />desde 2018</span></div><div className="story-copy"><p className="eyebrow">Da cozinha de casa</p><h2>Pequenos começos.<br /><em>Grandes sonhos.</em></h2><p className="lead-copy">A Dolce Delícia nasceu em um momento desafiador, quando cozinhar passou a ser também um jeito de recomeçar.</p><p>Os primeiros pães caseiros, mini pizzas e salgadinhos eram feitos com o que havia de mais valioso: receitas de família, persistência e atenção verdadeira a cada cliente. As encomendas aumentaram, a cozinha ficou pequena e uma equipe começou a tomar forma.</p><p>O encontro com as escolas de Toledo revelou uma nova paixão: criar lanches infantis com cuidado. Depois vieram as cantinas, as refeições completas e novos pontos de venda — sempre com a mesma essência.</p><blockquote>“Por trás de cada fornada está a alma de quem não teve medo de começar pequeno.”</blockquote></div></div></section>
      <section className="section values-section"><div className="container"><div className="section-heading centered light"><p className="eyebrow light">O que nos guia</p><h2>Carinho é ingrediente.<br /><em>Cuidado é compromisso.</em></h2></div><div className="value-grid"><article><span>01</span><h3>Missão</h3><p>Oferecer alimentos saborosos, seguros e de qualidade, tornando a rotina de crianças, famílias e comunidades mais prática e prazerosa.</p></article><article><span>02</span><h3>Visão</h3><p>Ser referência regional em alimentação escolar e produtos alimentícios, reconhecida por excelência, inovação e confiança.</p></article><article><span>03</span><h3>Valores</h3><p>Qualidade, segurança alimentar, honestidade, respeito, dedicação, melhoria contínua e compromisso com a comunidade.</p></article></div></div></section>
      <section className="section timeline-section"><div className="container"><div className="section-heading split-heading"><div><p className="eyebrow">Nossa jornada</p><h2>Uma história feita<br /><em>fornada por fornada.</em></h2></div><p>Cada ano trouxe um novo desafio, uma porta aberta e mais gente para compartilhar a nossa mesa.</p></div><ol className="timeline">{timeline.map((item) => <li key={item.year}><strong>{item.year}</strong><span /><p>{item.text}</p></li>)}</ol></div></section>
      <section className="final-cta"><div className="container"><p className="eyebrow light">Faça parte dessa história</p><h2>Tem sempre um lugar<br /><em>para você na nossa mesa.</em></h2><a className="button button-light" href={createWhatsAppUrl("Olá! Acabei de conhecer a história da Dolce e gostaria de fazer um pedido.")} target="_blank" rel="noreferrer">Conversar com a equipe <span aria-hidden="true">↗</span></a></div></section>
    </>
  );
}
