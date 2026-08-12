type PageHeroProps = {
  eyebrow: string;
  title: string;
  text: string;
  accent?: string;
};

export function PageHero({ eyebrow, title, text, accent }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="page-hero-shape" aria-hidden="true" />
      <div className="container page-hero-inner">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title} {accent && <em>{accent}</em>}</h1>
        <p className="page-lead">{text}</p>
      </div>
    </section>
  );
}
