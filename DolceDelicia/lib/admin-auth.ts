import { getChatGPTUser, requireChatGPTUser, type ChatGPTUser } from "@/app/chatgpt-auth";
import { getD1 } from "@/db";

export type AdminIdentity = {
  id: number;
  userId: string | null;
  email: string;
  name: string;
  role: "owner" | "manager";
  locationId: number | null;
  user: ChatGPTUser;
};

type AdminRow = { id: number; user_id: string | null; email: string; name: string; role: "owner" | "manager"; location_id: number | null };

async function findAdmin(user: ChatGPTUser): Promise<AdminIdentity | null> {
  const database = getD1();
  const row = await database.prepare(`
    SELECT id, user_id, email, name, role, location_id FROM admins
    WHERE active = 1 AND (user_id = ? OR lower(email) = lower(?)) LIMIT 1
  `).bind(user.userId, user.email).first<AdminRow>();
  if (!row) return null;
  if (!row.user_id) {
    await database.prepare("UPDATE admins SET user_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id IS NULL").bind(user.userId, row.id).run();
  }
  return { id: row.id, userId: row.user_id ?? user.userId, email: row.email, name: row.name, role: row.role, locationId: row.location_id, user };
}

export async function getAuthorizedAdmin(): Promise<AdminIdentity | null> {
  const user = await getChatGPTUser();
  return user ? findAdmin(user) : null;
}

export async function requireAdminPage(): Promise<{ user: ChatGPTUser; admin: AdminIdentity | null }> {
  const user = await requireChatGPTUser("/admin");
  return { user, admin: await findAdmin(user) };
}
