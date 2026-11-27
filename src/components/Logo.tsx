import React from "react";

interface LogoProps {
    lightText?: boolean;
}

export default function Logo({ lightText = false }: LogoProps) {
    const navyColor = lightText ? "#FFFFFF" : "#0B1D48";

    return (
        <div className="inline-flex items-center gap-3 select-none">
            {/* أيقونة الباب المفتوح وعلامة الصح الخضراء */}
            <svg
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://w3.org"
                className="w-11 h-11 shrink-0"
            >
                {/* إطار الباب */}
                <rect
                    x="10"
                    y="8"
                    width="36"
                    height="48"
                    rx="5"
                    stroke={navyColor}
                    strokeWidth="4"
                />
                {/* ضلفة الباب المفتوحة */}
                <path
                    d="M11 9.5L29 15V49L11 54.5V9.5Z"
                    fill={navyColor}
                />
                {/* مقبض الباب */}
                <circle
                    cx="24.5"
                    cy="32"
                    r="2"
                    fill={lightText ? "#0F172A" : "#FFFFFF"}
                />
                {/* حدود بيضاء فاصلة لعلامة الصح */}
                <path
                    d="M19 36L28.5 45.5L54 19"
                    stroke={lightText ? "#0F172A" : "#FFFFFF"}
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                {/* علامة الصح الخضراء */}
                <path
                    d="M19 36L28.5 45.5L54 19"
                    stroke="#109A58"
                    strokeWidth="5.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>

            {/* نص الشعار بالضمة */}
            <div className="leading-none">
                <div
                    className={`text-2xl sm:text-[26px] font-black tracking-tight ${lightText ? "text-white" : "text-[#0B1D48]"
                        }`}
                >
                    مُتاح
                </div>
                <div
                    className={`text-[11px] font-extrabold tracking-[0.22em] mt-1 ${lightText ? "text-emerald-400" : "text-[#0B1D48]"
                        }`}
                >
                    MOTAH
                </div>
            </div>
        </div>
    );
}
