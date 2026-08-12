import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { headers } from "next/headers";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { WhatsAppButton } from "../components/WhatsAppButton";
import "./globals.css";

const sans = DM_Sans({ variable: "--font-sans", subsets: ["latin"] });
const display = Playfair_Display({ variable: "--font-display", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");

  return {
    metadataBase: new URL(`${protocol}://${host}`),
    title: { default: "Dolce Delícia", template: "%s | Dolce Delícia" },
    description: "Doces, salgados, refeições e encomendas preparados com carinho em Toledo, Paraná.",
    icons: { icon: "/images/logo.png", shortcut: "/images/logo.png" },
    openGraph: {
      title: "Dolce Delícia — sabor que acolhe",
      description: "Receitas com afeto para sua rotina, sua festa e seus melhores encontros.",
      images: [{ url: "/og.png", width: 1734, height: 907, alt: "Dolce Delícia — sabor que acolhe" }],
      locale: "pt_BR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Dolce Delícia — sabor que acolhe",
      description: "Receitas com afeto para sua rotina, sua festa e seus melhores encontros.",
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${sans.variable} ${display.variable}`}>
        <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
        <SiteHeader />
        <main id="conteudo">{children}</main>
        <SiteFooter />
        <WhatsAppButton />
      </body>
    </html>
  );
}
