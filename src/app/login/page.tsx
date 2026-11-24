"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Mail, Lock, Loader2 } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        if (isSignUp) {
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) {
                setMessage("خطأ: " + error.message);
            } else {
                setMessage("تم إنشاء الحساب بنجاح! يمكنك تسجيل الدخول الآن.");
                setIsSignUp(false);
            }
        } else {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                setMessage("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
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

                <div className="text-center mb-8">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-bold text-2xl flex items-center justify-center mx-auto mb-3">
                        م<span className="text-emerald-400">.</span>
                    </div>
                    <h1 className="text-2xl font-extrabold text-slate-900">
                        {isSignUp ? "إنشاء حساب جديد في مُتاح" : "تسجيل الدخول إلى مُتاح"}
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        أضف إعلاناتك وتواصل مع أهالي شبين القناطر وقراها
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                            البريد الإلكتروني
                        </label>
                        <div className="relative flex items-center">
                            <Mail className="w-5 h-5 text-slate-400 absolute right-3" />
                            <input
                                type="email"
                                required
                                placeholder="example@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pr-10 pl-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                            كلمة المرور
                        </label>
                        <div className="relative flex items-center">
                            <Lock className="w-5 h-5 text-slate-400 absolute right-3" />
                            <input
                                type="password"
                                required
                                minLength={6}
                                placeholder="6 أحرف أو أرقام على الأقل"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pr-10 pl-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                    </div>

                    {message && (
                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        <span>{isSignUp ? "إنشاء الحساب" : "دخول"}</span>
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-600">
                    {isSignUp ? "لديك حساب بالفعل؟" : "ليس لديك حساب؟"}{" "}
                    <button
                        type="button"
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setMessage("");
                        }}
                        className="text-emerald-600 font-bold hover:underline"
                    >
                        {isSignUp ? "سجّل الدخول" : "أنشئ حساباً مجانياً"}
                    </button>
                </div>
            </div>
        </div>
    );
}
