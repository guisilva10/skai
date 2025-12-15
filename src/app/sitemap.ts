import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;
  return [
    {
      url: baseUrl,
      changeFrequency: "weekly",
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: `${baseUrl}/auth/login`,
      changeFrequency: "weekly",
      lastModified: new Date(),
      priority: 0.5,
    },
    {
      url: `${baseUrl}/auth/register`,
      changeFrequency: "weekly",
      lastModified: new Date(),
      priority: 0.5,
    },
  ];
}
