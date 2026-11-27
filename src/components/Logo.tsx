import React from "react";

interface LogoProps {
    lightText?: boolean;
}

export default function Logo({ lightText = false }: LogoProps) {
    return (
        <div className="inline-flex items-center gap-2.5 select-none">
            {/* أيقونة الشعار الهندسية */}
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-sky-600 to-emerald-500 flex items-center justify-center shadow-md shadow-sky-600/20">
                <svg
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://w3.org"
                    className="w-6 h-6"
                >
                    {/* إطار دبوس الموقع مع علامة التوفر */}
                    <path
                        d="M18 4C11.9249 4 7 8.92487 7 15C7 22.5 18 32 18 32C18 32 29 22.5 29 15C29 8.92487 24.0751 4 18 4Z"
                        stroke="white"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M13.5 15.5L16.5 18.5L22.5 12.5"
                        stroke="white"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />
            </div>

            {/* اسم المنصة */}
            <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                    <span
                        className={`text-xl font-extrabold tracking-tight ${lightText ? "text-white" : "text-slate-900"
                            }`}
                    >
                        مُتاح
                    </span>
                    <span className="text-[11px] font-extrabold px-1.5 py-0.5 rounded-md bg-sky-500/15 text-sky-600">
                        Motah
                    </span>
                </div>
                <p
                    className={`text-[11px] font-medium ${lightText ? "text-slate-400" : "text-slate-500"
                        }`}
                >
                    شبين القناطر وقراها
                </p>
            </div>
        </div>
    );
}
