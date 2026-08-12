import type { Metadata } from "next";
import { locations, menuItems, socials } from "../data/site";
import { createWhatsAppUrl } from "../lib/whatsapp";

export const metadata: Metadata = {
  title: "Dolce Delícia",
  description: "Doces, salgados e momentos preparados com carinho em Toledo, Paraná.",
};

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function Home() {
  const featured = menuItems.slice(0, 3);
  return (
    <>
      <section className="home-hero">
        <video className="hero-video" autoPlay loop muted playsInline poster="/images/about.jpg"><source src="/images/hero.mp4" type="video/mp4" /></video>
        <div className="hero-overlay" />
        <div className="container hero-content">
          <p className="eyebrow light">Receitas que viram lembranças</p>
          <h1>Feito para <em>celebrar</em><br />cada pedacinho da vida.</h1>
          <p>Doces, salgados e refeições preparados com cuidado — da pausa no trabalho à mesa da sua festa.</p>
          <div className="button-row">
            <a className="button button-light" href="/cardapio">Conhecer o cardápio <span aria-hidden="true">↗</span></a>
            <a className="text-link light" href={createWhatsAppUrl("Olá! Vim pelo site e gostaria de fazer uma encomenda.")} target="_blank" rel="noreferrer">Fazer uma encomenda <span aria-hidden="true">→</span></a>
          </div>
        </div>
        <a className="scroll-cue" href="#sabores"><span>Descubra</span><i aria-hidden="true">↓</i></a>
      </section>

      <section className="marquee" aria-label="Especialidades"><div><span>Doces artesanais</span><i>✦</i><span>Salgados para festas</span><i>✦</i><span>Lanches escolares</span><i>✦</i><span>Refeições com carinho</span><i>✦</i></div></section>

      <section className="section" id="sabores">
        <div className="container">
          <div className="section-heading split-heading"><div><p className="eyebrow">Escolha seu momento</p><h2>Tem sabor para<br /><em>todo tipo de vontade.</em></h2></div><p>Do doce que muda o dia ao cento de salgados que reúne todo mundo. Escolha uma categoria e descubra seu próximo favorito.</p></div>
          <div className="category-showcase">
            <a className="category-card card-tall" href="/cardapio?categoria=doces"><img src="/images/menu/bombom.jpg" alt="Bombom aberto cremoso" width="620" height="800" /><span>01</span><div><p>Feitos à mão</p><h3>Doces</h3><i>Ver opções →</i></div></a>
            <a className="category-card" href="/cardapio?categoria=salgados"><img src="/images/menu/coxinhas.jpg" alt="Coxinhas douradas" width="620" height="380" /><span>02</span><div><p>Para qualquer hora</p><h3>Salgados</h3><i>Ver opções →</i></div></a>
            <a className="category-card" href="/cardapio?categoria=combos"><img src="/images/menu/cento-misto.jpg" alt="Seleção de salgados para festa" width="620" height="380" /><span>03</span><div><p>Do tamanho da festa</p><h3>Combos</h3><i>Ver opções →</i></div></a>
          </div>
        </div>
      </section>

      <section className="section section-rose">
        <div className="container story-grid">
          <div className="story-images"><img className="story-main" src="/images/about.jpg" alt="Equipe e produção da Dolce Delícia" width="720" height="850" /><img className="story-detail" src="/images/social/social-2.png" alt="Detalhe de uma produção artesanal" width="320" height="390" /><span className="stamp">Desde<br /><strong>2018</strong><br />Toledo — PR</span></div>
          <div className="story-copy"><p className="eyebrow">Nossa essência</p><h2>Começou em casa.<br />Cresceu com <em>coragem.</em></h2><p className="lead-copy">A Dolce nasceu de uma necessidade real e de receitas que já atravessavam gerações.</p><p>Sem grandes vitrines, a primeira fornada saiu da cozinha de casa. Cada pão, mini pizza e salgado carregava carinho — e foi assim, de cliente em cliente, que a nossa mesa cresceu.</p><blockquote>“A essência continua a mesma daquela primeira receita: dedicação, respeito e afeto em tudo o que fazemos.”</blockquote><a className="text-link" href="/sobre">Conheça nossa história <span aria-hidden="true">→</span></a></div>
        </div>
      </section>

      <section className="section products-section">
        <div className="container">
          <div className="section-heading centered"><p className="eyebrow">Os queridinhos</p><h2>Difícil escolher.<br /><em>Fácil se apaixonar.</em></h2></div>
          <div className="featured-products">
            {featured.map((item) => <article className="featured-card" key={item.id}><a href="/cardapio"><div><img src={item.image} alt={item.name} width="620" height="500" loading="lazy" />{item.badge && <span>{item.badge}</span>}</div><p>{item.category}</p><h3>{item.name}</h3><strong>{currency.format(item.price)}</strong></a></article>)}
          </div>
          <div className="center-action"><a className="button button-outline" href="/cardapio">Ver cardápio completo <span aria-hidden="true">↗</span></a></div>
        </div>
      </section>

      <section className="section location-section">
        <div className="container">
          <div className="section-heading split-heading light"><div><p className="eyebrow light">Pertinho de você</p><h2>Três jeitos de<br /><em>encontrar a Dolce.</em></h2></div><p>Passe para um café, escolha um lanche ou retire sua encomenda. Confira o ponto mais conveniente.</p></div>
          <div className="home-locations">
            {locations.map((location, index) => <article className="home-location" key={location.id}><div className="location-photo"><img src={location.image} alt={`Unidade ${location.name}`} width="720" height="480" loading="lazy" /><span>0{index + 1}</span></div><div><p>{location.subtitle}</p><h3>{location.name}</h3><address>{location.address}</address><small>{location.hours}</small><a href={location.mapsUrl} target="_blank" rel="noreferrer">Ver rota <span aria-hidden="true">↗</span></a></div></article>)}
          </div>
        </div>
      </section>

      <section className="section social-section">
        <div className="container social-heading"><div><p className="eyebrow">Da nossa cozinha</p><h2>Um pouco de afeto<br /><em>passando no seu feed.</em></h2></div><a className="text-link" href={socials.instagram} target="_blank" rel="noreferrer">@dolcedeliciasoficial <span aria-hidden="true">↗</span></a></div>
        <div className="social-strip">{[1,2,3,4].map((number) => <a key={number} href={socials.instagram} target="_blank" rel="noreferrer"><img src={`/images/social/social-${number}.png`} alt={`Publicação ${number} da Dolce Delícia no Instagram`} width="460" height="460" loading="lazy" /><span aria-hidden="true">◎</span></a>)}</div>
      </section>

      <section className="final-cta"><div className="container"><p className="eyebrow light">Vamos adoçar seu dia?</p><h2>Seu próximo momento<br /><em>especial começa aqui.</em></h2><a className="button button-light" href={createWhatsAppUrl("Olá! Quero fazer um pedido na Dolce Delícia.")} target="_blank" rel="noreferrer">Falar com a Dolce <span aria-hidden="true">↗</span></a></div></section>
    </>
  );
}
