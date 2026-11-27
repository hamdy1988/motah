import { ImageResponse } from "next/og";

export const size = {
    width: 64,
    height: 64,
};
export const contentType = "image/png";

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#FFFFFF",
                    borderRadius: "14px",
                }}
            >
                <svg
                    width="56"
                    height="56"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://w3.org"
                >
                    <rect
                        x="10"
                        y="8"
                        width="36"
                        height="48"
                        rx="5"
                        stroke="#0B1D48"
                        strokeWidth="4.5"
                    />
                    <path d="M11 9.5L29 15V49L11 54.5V9.5Z" fill="#0B1D48" />
                    <circle cx="24.5" cy="32" r="2" fill="#FFFFFF" />
                    <path
                        d="M19 36L28.5 45.5L54 19"
                        stroke="#FFFFFF"
                        strokeWidth="9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M19 36L28.5 45.5L54 19"
                        stroke="#109A58"
                        strokeWidth="5.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        ),
        { ...size }
    );
}
