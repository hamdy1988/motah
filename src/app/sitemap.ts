import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://" + "motah-mrr2.vercel.app";
    return [
        { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
        { url: baseUrl + "/clinics", lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
        { url: baseUrl + "/stores", lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
        { url: baseUrl + "/craftsmen", lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
        { url: baseUrl + "/about", lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
        { url: baseUrl + "/privacy", lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ];
}
