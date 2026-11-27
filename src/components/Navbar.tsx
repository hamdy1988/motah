"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import {
    Home,
    Store,
    Stethoscope,
    Hammer,
    PlusCircle,
} from "lucide-react";

export default function Navbar() {
    const pathname = usePathname();

    // إخفاء الشريط في الصفحة الرئيسية ولوحة الإدارة لأن لكل منهما شريط خاص
    if (pathname === "/" || pathname.startsWith("/admin")) {
        return null;
    }

    const navLinks = [
        { href: "/stores", label: "المتاجر", icon: Store },
        { href: "/clinics", label: "العيادات", icon: Stethoscope },
        { href: "/craftsmen", label: "الصنايعية", icon: Hammer },
    ];

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
                {/* اللوجو */}
                <Link href="/" className="shrink-0">
                    <Logo />
                </Link>

                {/* روابط الأقسام السريعة */}
                <nav className="hidden md:flex items-center gap-1.5">
                    {navLinks.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold transition ${isActive
                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                    }`}
                            >
                                <Icon className="w-4 h-4 text-emerald-600" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* زر العودة للرئيسية الواضح + إضافة إعلان */}
                <div className="flex items-center gap-2">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold px-3.5 py-2.5 rounded-xl shadow-sm transition"
                    >
                        <Home className="w-4 h-4 text-emerald-400" />
                        <span>الرئيسية</span>
                    </Link>

                    <Link
                        href="/add-listing"
                        className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-3.5 py-2.5 rounded-xl shadow-sm transition"
                    >
                        <PlusCircle className="w-4 h-4" />
                        <span>أضف إعلان</span>
                    </Link>
                </div>
            </div>

            {/* شريط الأقسام السفلي للهواتف المحمولة */}
            <div className="flex md:hidden items-center justify-around border-t border-slate-100 bg-slate-50/90 py-1.5 px-2">
                {navLinks.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition ${isActive
                                    ? "bg-emerald-600 text-white"
                                    : "text-slate-700 hover:bg-slate-200"
                                }`}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </header>
    );
}
