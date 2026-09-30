import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseHost = supabaseUrl ? new URL(supabaseUrl) : null;
// Supabase local (supabase start) corre en 127.0.0.1: solo entonces se permite IP local.
const isLocalSupabase = supabaseHost?.hostname === "127.0.0.1" || supabaseHost?.hostname === "localhost";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseHost
      ? [
          {
            protocol: supabaseHost.protocol.replace(":", "") as "http" | "https",
            hostname: supabaseHost.hostname,
            port: supabaseHost.port,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
    dangerouslyAllowLocalIP: isLocalSupabase,
  },
  experimental: {
    // Subidas de fotos van directo al bucket; los formularios del admin son texto.
    serverActions: { bodySizeLimit: "2mb" },
  },
};

export default nextConfig;
