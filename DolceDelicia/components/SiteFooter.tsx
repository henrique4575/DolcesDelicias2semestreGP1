import { navLinks, socials } from "../data/site";
import { createWhatsAppUrl } from "../lib/whatsapp";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-ornament" aria-hidden="true">D</div>
      <div className="container footer-grid">
        <div className="footer-intro">
          <Link className="brand brand-footer" href="/">
            <img src="/images/logo.png" width="76" height="76" alt="" />
            <span><strong>Dolce</strong><small>Delícia</small></span>
          </Link>
          <p>Receitas com afeto, cuidado e aquele sabor que deixa qualquer encontro mais especial.</p>
          <div className="social-links" aria-label="Redes sociais">
            <a href={socials.instagram} target="_blank" rel="noreferrer">Instagram</a>
            <a href={socials.facebook} target="_blank" rel="noreferrer">Facebook</a>
          </div>
        </div>
        <div>
          <p className="footer-title">Explore</p>
          <ul className="footer-links">
            {navLinks.map((link) => <li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}
          </ul>
        </div>
        <div>
          <p className="footer-title">Atendimento</p>
          <ul className="footer-links">
            <li><a href={socials.phone}>(45) 99806-4748</a></li>
            <li><a href={socials.email}>chris.colodel@hotmail.com</a></li>
            <li><a href={createWhatsAppUrl("Olá! Gostaria de falar com a Dolce Delícia.")} target="_blank" rel="noreferrer">Chamar no WhatsApp</a></li>
          </ul>
          <p className="footer-note">Toledo — Paraná</p>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© 2026 Dolce Delícia. Todos os direitos reservados.</p>
        <p>Feito para adoçar encontros.</p>
      </div>
    </footer>
  );
}
