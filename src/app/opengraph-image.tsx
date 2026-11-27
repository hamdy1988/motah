import { ImageResponse } from "next/og";

export const alt = "منصة مُتاح - دليل خدمات شبين القناطر وقراها";
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = "image/png";

export default function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #0f172a 0%, #0369a1 60%, #059669 100%)",
                    color: "white",
                    padding: "60px",
                    textAlign: "center",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(255,255,255,0.12)",
                        border: "2px solid rgba(255,255,255,0.25)",
                        borderRadius: "24px",
                        padding: "14px 36px",
                        fontSize: 32,
                        fontWeight: 700,
                        marginBottom: "30px",
                    }}
                >
                    شبين القناطر وجميع القرى التابعة لها
                </div>
                <div style={{ fontSize: 96, fontWeight: 900, marginBottom: "20px" }}>
                    مُتاح | Motah
                </div>
                <div style={{ fontSize: 38, color: "#e2e8f0", maxWidth: "900px" }}>
                    عيادات • متاجر ومحلات • صنايعية وحرفيون • بيع وإيجار مباشر
                </div>
            </div>
        ),
        { ...size }
    );
}
