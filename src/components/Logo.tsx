import React from "react";

interface LogoProps {
    lightText?: boolean;
}

export default function Logo({ lightText = false }: LogoProps) {
    return (
        <div className="inline-flex items-center gap-3 select-none">
            {/* أيقونة اللوجو رقم 2: حرف م الهندسي مع علامة الصح الخضراء */}
            <div className="relative w-11 h-11 rounded-2xl bg-slate-800 border border-slate-700/80 flex items-center justify-center shadow-md">
                <svg
                    viewBox="0 0 44 44"
                    fill="none"
                    xmlns="http://w3.org"
                    className="w-8 h-8"
                >
                    {/* حرف م هندسي أبيض */}
                    <path
                        d="M14 33V21C14 15.5 18.2 11.5 23.5 11.5C28.8 11.5 32.5 15.2 32.5 20.2C32.5 24.8 29 27.5 24.5 27.5H19.5"
                        stroke="white"
                        strokeWidth="3.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {/* علامة التوفر / الصح الخضراء المتداخلة */}
                    <path
                        d="M8.5 24.5L15.5 31.5L35.5 16.5"
                        stroke="#10B981"
                        strokeWidth="3.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            {/* نص الشعار */}
            <div className="leading-none">
                <div className="flex items-center gap-1.5">
                    <span
                        className={`text-2xl font-extrabold tracking-tight ${lightText ? "text-white" : "text-slate-900"
                            }`}
                    >
                        مُتاح
                    </span>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs font-extrabold text-emerald-500 tracking-wide">
                        Motah
                    </span>
                    <span
                        className={`text-[10px] font-medium ${lightText ? "text-slate-400" : "text-slate-500"
                            }`}
                    >
                        • شبين القناطر
                    </span>
                </div>
            </div>
        </div>
    );
}
