export const WHATSAPP_NUMBER = "5545998064748";

export function createWhatsAppUrl(message: string): string {
  const url = new URL(`https://wa.me/${WHATSAPP_NUMBER}`);
  url.searchParams.set("text", message.trim());
  return url.toString();
}
