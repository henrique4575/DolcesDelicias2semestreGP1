import { createWhatsAppUrl } from "../lib/whatsapp";

export function WhatsAppButton() {
  return (
    <a
      className="whatsapp-float"
      href={createWhatsAppUrl("Olá! Vim pelo site e gostaria de fazer um pedido.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Fazer pedido pelo WhatsApp"
    >
      <span aria-hidden="true">◖</span>
      <span>Peça pelo WhatsApp</span>
    </a>
  );
}
