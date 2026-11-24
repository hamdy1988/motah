"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Phone, Lock, User, MapPin, Loader2 } from "lucide-react";

const SHIBIN_AREAS = [
    "مدينة شبين القناطر",
    "كفر شبين",
    "طحانوب",
    "الأحراز",
    "الجعافرة",
    "القشيش",
    "منية شبين",
    "نوى",
    "تل بني تميم",
    "القلزم",
    "كفر طحا",
    "الشوبك",
    "الحزانية",
    "العطارة",
    "كفر الدير",
    "المريج",
];

export default function LoginPage() {
    const router = useRouter();
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [area, setArea] = useState("مدينة شبين القناطر");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(true);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const cleanPhone = phone.trim();
        const internalEmail = `${cleanPhone}@motah.app`;

        if (isSignUp) {
            const { data, error } = await supabase.auth.signUp({
                email: internalEmail,
                password,
            });

            if (error) {
                setMessage(
                    "حدث خطأ: " +
                    (error.message.includes("already registered")
                        ? "رقم الموبايل مسجل بالفعل، جرب تسجيل الدخول."
                        : error.message)
                );
            } else if (data.user) {
                await supabase.from("profiles").insert({
                    id: data.user.id,
                    full_name: fullName,
                    phone: cleanPhone,
                    area,
                });
                router.push("/");
                router.refresh();
            }
        } else {
            const { error } = await supabase.auth.signInWithPassword({
                email: internalEmail,
                password,
            });

            if (error) {
                setMessage("رقم الموبايل أو كلمة المرور غير صحيحة.");
            } else {
                router.push("/");
                router.refresh();
            }
        }
        setLoading(false);
    };
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 mb-6"
                >
                    <ArrowRight className="w-4 h-4" />
                    <span>العودة للرئيسية</span>
                </Link>

                <div className="text-center mb-6">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-bold text-2xl flex items-center justify-center mx-auto mb-3">
                        م<span className="text-emerald-400">.</span>
                    </div>
                    <h1 className="text-2xl font-extrabold text-slate-900">
                        {isSignUp ? "حساب جديد في مُتاح" : "تسجيل الدخول"}
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {isSignUp ? "سجل باسمك ورقم موبايلك وقريتك في ثوانٍ" : "ادخل برقم موبايلك وكلمة المرور"}
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                    {isSignUp && (
                        <>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">الاسم بالكامل</label>
                                <div className="relative flex items-center">
                                    <User className="w-5 h-5 text-slate-400 absolute right-3" />
                                    <input
                                        type="text"
                                        required
                                        placeholder="مثال: أحمد محمد"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full pr-10 pl-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">المدينة / القرية</label>
                                <div className="relative flex items-center">
                                    <MapPin className="w-5 h-5 text-emerald-600 absolute right-3" />
                                    <select
                                        value={area}
                                        onChange={(e) => setArea(e.target.value)}
                                        className="w-full pr-10 pl-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                                    >
                                        {SHIBIN_AREAS.map((a) => (
                                            <option key={a} value={a}>{a}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </>
                    )}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">رقم الموبايل</label>
                        <div className="relative flex items-center">
                            <Phone className="w-5 h-5 text-slate-400 absolute right-3" />
                            <input
                                type="tel"
                                required
                                pattern="[0-9]{11}"
                                placeholder="010xxxxxxxx (11 رقم)"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full pr-10 pl-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">كلمة المرور</label>
                        <div className="relative flex items-center">
                            <Lock className="w-5 h-5 text-slate-400 absolute right-3" />
                            <input
                                type="password"
                                required
                                minLength={6}
                                placeholder="6 أرقام أو حروف على الأقل"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pr-10 pl-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                            />
                        </div>
                    </div>

                    {message && (
                        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        <span>{isSignUp ? "إنشاء الحساب والدخول فوراً" : "دخول"}</span>
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-600">
                    {isSignUp ? "لديك حساب بالفعل؟" : "مستخدم جديد؟"}{" "}
                    <button
                        type="button"
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setMessage("");
                        }}
                        className="text-emerald-600 font-bold hover:underline"
                    >
                        {isSignUp ? "سجّل الدخول برقمك" : "أنشئ حساباً جديداً"}
                    </button>
                </div>
            </div>
        </div>
    );
}
