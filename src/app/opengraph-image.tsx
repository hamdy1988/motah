import { ImageResponse } from "next/og";

export const alt = "Motah - Shibin El Qanater Services Directory";
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
                        fontSize: 30,
                        fontWeight: 700,
                        marginBottom: "30px",
                    }}
                >
                    Shibin El Qanater &amp; Villages
                </div>
                <div style={{ fontSize: 108, fontWeight: 900, marginBottom: "20px" }}>
                    Motah
                </div>
                <div style={{ fontSize: 34, color: "#e2e8f0" }}>
                    Clinics • Stores • Craftsmen • Real Estate &amp; Cars
                </div>
            </div>
        ),
        { ...size }
    );
}
