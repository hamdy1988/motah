import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "منصة مُتاح | دليل شبين القناطر وقراها",
        short_name: "مُتاح",
        description:
            "منصة أهالي شبين القناطر وقراها للخدمات والإعلانات: عيادات، متاجر، صنايعية، عقارات، وسيارات.",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#0f172a",
        dir: "rtl",
        lang: "ar",
        icons: [
            {
                src: "/icon",
                sizes: "64x64",
                type: "image/png",
            },
        ],
    };
}
