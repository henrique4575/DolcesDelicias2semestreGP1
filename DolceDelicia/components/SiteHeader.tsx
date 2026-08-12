"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { navLinks } from "../data/site";
import { createWhatsAppUrl } from "../lib/whatsapp";

export function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", closeOnEscape);
    document.body.classList.toggle("nav-open", isOpen);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.classList.remove("nav-open");
    };
  }, [isOpen]);

  return (
    <header className="site-header">
      <div className="nav-shell">
        <Link className="brand" href="/" aria-label="Dolce Delícia — página inicial">
          <img src="/images/logo.png" width="66" height="66" alt="" />
          <span><strong>Dolce</strong><small>Delícia</small></span>
        </Link>
        <button
          className="menu-toggle"
          type="button"
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isOpen}
          aria-controls="primary-navigation"
          onClick={() => setIsOpen((value) => !value)}
        >
          <span /><span /><span />
        </button>
        <nav id="primary-navigation" className={isOpen ? "primary-nav is-open" : "primary-nav"} aria-label="Navegação principal">
          <ul>
            {navLinks.map((link) => {
              const current = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link href={link.href} aria-current={current ? "page" : undefined} onClick={() => setIsOpen(false)}>{link.label}</Link>
                </li>
              );
            })}
          </ul>
          <a className="button button-small" href={createWhatsAppUrl("Olá! Vim pelo site e gostaria de fazer um pedido.")} target="_blank" rel="noreferrer">
            Fazer pedido <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
