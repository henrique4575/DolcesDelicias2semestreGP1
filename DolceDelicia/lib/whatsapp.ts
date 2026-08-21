export const WHATSAPP_NUMBER = "5545998064748";

export function createWhatsAppUrl(message: string): string {
  return createUnitWhatsAppUrl(WHATSAPP_NUMBER, message);
}

export function createUnitWhatsAppUrl(number: string, message: string): string {
  const normalizedNumber = number.replace(/\D/g, "");
  const url = new URL(`https://wa.me/${normalizedNumber}`);
  url.searchParams.set("text", message.trim());
  return url.toString();
}
