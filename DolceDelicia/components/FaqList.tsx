"use client";

import { useMemo, useState } from "react";
import { faqItems } from "../data/site";

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
}

export function FaqList() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const term = normalize(query.trim());
    return faqItems.filter((item) => normalize(`${item.question} ${item.answer} ${item.category}`).includes(term));
  }, [query]);

  return (
    <div className="faq-browser">
      <label className="search-field faq-search">
        <span className="sr-only">Buscar nas perguntas frequentes</span>
        <span aria-hidden="true">⌕</span>
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Como podemos ajudar?" />
      </label>
      <div className="faq-list">
        {filtered.map((item, index) => (
          <details key={item.question} className="faq-item" open={index === 0 && !query}>
            <summary><span><small>{item.category}</small>{item.question}</span><i aria-hidden="true">+</i></summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
      {!filtered.length && <div className="empty-state compact"><h2>Não encontramos essa dúvida</h2><p>Fale com a equipe pelo WhatsApp e teremos prazer em ajudar.</p></div>}
    </div>
  );
}
