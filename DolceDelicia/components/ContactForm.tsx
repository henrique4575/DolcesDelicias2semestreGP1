"use client";

import { useState, type FormEvent } from "react";
import { createWhatsAppUrl } from "../lib/whatsapp";

type Errors = Partial<Record<"name" | "contact" | "message", string>>;

export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const contact = String(form.get("contact") ?? "").trim();
    const subject = String(form.get("subject") ?? "Atendimento");
    const message = String(form.get("message") ?? "").trim();
    const nextErrors: Errors = {};
    if (name.length < 2) nextErrors.name = "Conte para a gente como podemos chamar você.";
    if (contact.length < 8) nextErrors.contact = "Informe um telefone ou e-mail para retorno.";
    if (message.length < 10) nextErrors.message = "Escreva um pouco mais sobre o que você precisa.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const text = `Olá! Meu nome é ${name}.\nAssunto: ${subject}\nContato: ${contact}\n\n${message}`;
    window.open(createWhatsAppUrl(text), "_blank", "noopener,noreferrer");
  }

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <div className="form-heading"><p className="eyebrow">Mande uma mensagem</p><h2>Conte o que você precisa</h2><p>Ao enviar, abriremos o WhatsApp com sua mensagem pronta.</p></div>
      <div className="field-grid">
        <label className="field"><span>Seu nome</span><input name="name" type="text" autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} placeholder="Como podemos chamar você?" />{errors.name && <small id="name-error">{errors.name}</small>}</label>
        <label className="field"><span>Telefone ou e-mail</span><input name="contact" type="text" autoComplete="tel" aria-invalid={Boolean(errors.contact)} aria-describedby={errors.contact ? "contact-error" : undefined} placeholder="(45) 99999-9999" />{errors.contact && <small id="contact-error">{errors.contact}</small>}</label>
      </div>
      <label className="field"><span>Assunto</span><select name="subject" defaultValue="Encomenda"><option>Encomenda</option><option>Festa ou evento</option><option>Dúvida sobre produto</option><option>Parceria comercial</option><option>Outro assunto</option></select></label>
      <label className="field"><span>Mensagem</span><textarea name="message" rows={5} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "message-error" : undefined} placeholder="Conte os detalhes do pedido ou da sua dúvida..." />{errors.message && <small id="message-error">{errors.message}</small>}</label>
      <button className="button" type="submit">Continuar no WhatsApp <span aria-hidden="true">↗</span></button>
    </form>
  );
}
