import type { Metadata } from "next";
import { chatGPTSignOutPath } from "@/app/chatgpt-auth";
import { AdminDashboard } from "@/components/AdminDashboard";
import { requireAdminPage } from "@/lib/admin-auth";

export const metadata: Metadata = { title: "Painel administrativo" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { user, admin } = await requireAdminPage();
  if (!admin) return <div className="admin-denied"><div><span className="eyebrow">Acesso restrito</span><h1>Esta conta não administra a Dolce Delícia.</h1><p>Você entrou como <strong>{user.email}</strong>. Use a conta autorizada ou volte ao site.</p><div><a className="button primary" href={chatGPTSignOutPath("/admin")}>Trocar de conta</a><a className="button ghost" href="/">Voltar ao site</a></div></div></div>;
  return <AdminDashboard identity={{ name: admin.name, email: admin.email, role: admin.role }} signOutPath={chatGPTSignOutPath("/")} />;
}
