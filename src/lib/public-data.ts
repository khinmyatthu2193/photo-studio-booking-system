import "server-only";

import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database.types";

type Package = Tables<"packages">;
type Addon = Tables<"addons">;
type PortfolioItem = Tables<"portfolio">;

export type PublicAddon = Pick<Addon, "description" | "id" | "name" | "price">;

export type PublicPackage = Pick<
  Package,
  | "description"
  | "duration_minutes"
  | "id"
  | "included_locations"
  | "included_outfits"
  | "included_photos"
  | "name"
  | "price"
>;

export type PublicPortfolioItem = Pick<
  PortfolioItem,
  | "category"
  | "description"
  | "id"
  | "image_path"
  | "is_featured"
  | "title"
> & {
  imageUrl: string;
};

export type PublicDataResult<T> =
  | { data: T; status: "ready" }
  | { data: T; status: "error" };

export const getActivePackages = cache(
  async (): Promise<PublicDataResult<PublicPackage[]>> => {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("packages")
        .select(
          "id,name,description,price,duration_minutes,included_photos,included_outfits,included_locations",
        )
        .eq("is_active", true)
        .order("display_order", { ascending: true })
        .order("name", { ascending: true });

      if (error) {
        return { data: [], status: "error" };
      }

      return { data, status: "ready" };
    } catch {
      return { data: [], status: "error" };
    }
  },
);

export const getActiveAddons = cache(
  async (): Promise<PublicDataResult<PublicAddon[]>> => {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("addons")
        .select("id,name,description,price")
        .eq("is_active", true)
        .order("name", { ascending: true });

      if (error) {
        return { data: [], status: "error" };
      }

      return { data, status: "ready" };
    } catch {
      return { data: [], status: "error" };
    }
  },
);

export const getPublishedPortfolio = cache(
  async (): Promise<PublicDataResult<PublicPortfolioItem[]>> => {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("portfolio")
        .select(
          "id,title,category,description,image_path,is_featured,display_order,created_at",
        )
        .eq("is_published", true)
        .order("is_featured", { ascending: false })
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) {
        return { data: [], status: "error" };
      }

      const items = data.map((item) => ({
        ...item,
        imageUrl: supabase.storage
          .from("portfolio")
          .getPublicUrl(item.image_path).data.publicUrl,
      }));

      return { data: items, status: "ready" };
    } catch {
      return { data: [], status: "error" };
    }
  },
);

export type StudioSettings = Tables<"studio_settings">;
export const getStudioSettings = cache(async (): Promise<PublicDataResult<StudioSettings | null>> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("studio_settings").select("*").eq("id", "default").maybeSingle();
    return error ? { data: null, status: "error" } : { data, status: "ready" };
  } catch { return { data: null, status: "error" }; }
});
