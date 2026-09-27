import type { NextConfig } from "next";

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];

try {
  const supabaseUrl = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "");

  if (supabaseUrl.protocol === "https:" || supabaseUrl.protocol === "http:") {
    remotePatterns.push({
      hostname: supabaseUrl.hostname,
      pathname: "/storage/v1/object/public/portfolio/**",
      port: supabaseUrl.port,
      protocol: supabaseUrl.protocol === "http:" ? "http" : "https",
    });
  }
} catch {
  // The public pages render a clear data error until Supabase is configured.
}

const nextConfig: NextConfig = {
  experimental: { serverActions: { bodySizeLimit: "11mb" } },
  images: { remotePatterns },
};

export default nextConfig;
