import type { MetadataRoute } from "next";

const BASE_URL = "https://wesafeapp.fr";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/dashboard/",
        "/auth",
        "/auth/",
        "/api/",
        "/profile/",
        "/contracts/",
        "/reset-password",
        "/unauthorized",
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
