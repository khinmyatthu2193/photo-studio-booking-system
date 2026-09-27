import "server-only";
import { randomUUID } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";
export type PortfolioCategory = Database["public"]["Enums"]["portfolio_category"];
export type PortfolioInput = { title: string; category: PortfolioCategory; description: string; display_order: number; is_featured: boolean; is_published: boolean };
export async function getAdminPortfolio() { const db = await createClient(); const { data, error } = await db.from("portfolio").select("*").order("display_order"); return { data: (data ?? []).map((item) => ({ ...item, imageUrl: db.storage.from("portfolio").getPublicUrl(item.image_path).data.publicUrl })), error: !!error }; }
export async function uploadPortfolioRow(input: PortfolioInput, file: File) {
  const types: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" };
  const ext = types[file.type];
  if (!ext || file.size < 1 || file.size > 10 * 1024 * 1024) return "Choose a JPEG, PNG, WebP, or AVIF image up to 10 MB.";
  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const ascii = (start: number, end: number) => String.fromCharCode(...bytes.slice(start, end));
  const valid = (ext === "jpg" && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) ||
    (ext === "png" && bytes[0] === 137 && ascii(1, 4) === "PNG") ||
    (ext === "webp" && ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") ||
    (ext === "avif" && ascii(4, 8) === "ftyp" && ["avif", "avis"].includes(ascii(8, 12)));
  if (!valid) return "Image content does not match its type.";
  const db = await createClient(); const path = `images/${randomUUID()}.${ext}`;
  const { error: uploadError } = await db.storage.from("portfolio").upload(path, file, { contentType: file.type, upsert: false });
  if (uploadError) return "Image upload failed.";
  const { error } = await db.from("portfolio").insert({ ...input, image_path: path });
  if (error) { await db.storage.from("portfolio").remove([path]); return "Image details could not be saved."; }
  return null;
}
export async function savePortfolioRow(id: string, input: PortfolioInput) { const db = await createClient(); const { error } = await db.from("portfolio").update(input).eq("id", id); return !error; }
export async function deletePortfolioRow(id: string) { const db = await createClient(); const { data } = await db.from("portfolio").select("image_path").eq("id", id).maybeSingle(); if (!data) return false; const { error } = await db.from("portfolio").delete().eq("id", id); if (error) return false; await db.storage.from("portfolio").remove([data.image_path]); return true; }
