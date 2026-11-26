"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { SHIBIN_VILLAGES } from "@/lib/areas";
import {
    ArrowRight,
    Hammer,
    MapPin,
    Phone,
    MessageCircle,
    PlusCircle,
    Search,
    Loader2,
    Award,
} from "lucide-react";

const PROFESSIONS = [
    "سباك",
    "كهربائي",
    "نجار",
    "نقاش",
    "محارة وبناء",
    "فني تكييف وتبريد",
    "حداد وألوميتال",
    "فني دش وستالايت",
    "ميكانيكي سيارات",
    "فني أجهزة منزلية",
];

interface Craftsman {
    id: string;
    name: string;
    profession: string;
    area: string;
    phone: string;
    experience_years: number;
    bio: string | null;
}

export default function CraftsmenPage() {
    const [craftsmen, setCraftsmen] = useState<Craftsman[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    const [selectedArea, setSelectedArea] = useState("كل شبين القناطر وقراها");
    const [selectedProf, setSelectedProf] = useState("كل التخصصات");
    const [showForm, setShowForm] = useState(false);

    const [name, setName] = useState("");
    const [profession, setProfession] = useState("سباك");
    const [area, setArea] = useState("مدينة شبين القناطر");
    const [phone, setPhone] = useState("");
    const [experience, setExperience] = useState("5");
    const [bio, setBio] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const fetchCraftsmen = async () => {
        const { data } = await supabase
            .from("craftsmen")
            .select("*")
            .order("created_at", { ascending: false });
        if (data) setCraftsmen(data);
        setLoading(false);
    };

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUserId(data.user?.id || null);
        });
        fetchCraftsmen();
    }, []);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;
        setSubmitting(true);

        const { error } = await supabase.from("craftsmen").insert({
            user_id: userId,
            name,
            profession,
            area,
            phone,
            experience_years: Number(experience),
            bio,
        });

        setSubmitting(false);
        if (!error) {
            setShowForm(false);
            setName("");
            setPhone("");
            setBio("");
            fetchCraftsmen();
        } else {
            alert("حدث خطأ: " + error.message);
        }
    };
    const filteredCraftsmen = craftsmen.filter((item) => {
        const matchArea =
            selectedArea === "كل شبين القناطر وقراها" || item.area === selectedArea;
        const matchProf =
            selectedProf === "كل التخصصات" || item.profession === selectedProf;
        return matchArea && matchProf;
    });

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <div>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 mb-2"
                        >
                            <ArrowRight className="w-4 h-4" />
                            <span>العودة للرئيسية</span>
                        </Link>
                        <div className="flex items-center gap-2.5">
                            <div className="w-11 h-11 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm">
                                <Hammer className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                                    دليل الصنايعية والحرفيين
                                </h1>
                                <p className="text-sm text-slate-500">
                                    تواصل مباشرة مع أمهر الصنايعية في شبين القناطر وقراها
                                </p>
                            </div>
                        </div>
                    </div>

                    {userId ? (
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold px-5 py-3 rounded-xl shadow-sm transition"
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span>{showForm ? "إغلاق النموذج" : "سجّل نفسك كصنايعي"}</span>
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold px-5 py-3 rounded-xl transition"
                        >
                            <span>سجّل الدخول لإضافة حرفتك</span>
                        </Link>
                    )}
                </div>

                {showForm && (
                    <form
                        onSubmit={handleRegister}
                        className="bg-white rounded-2xl border border-purple-200 p-6 mb-8 shadow-md space-y-4"
                    >
                        <h2 className="text-lg font-extrabold text-slate-900">تسجيل بيانات الصنايعي</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">الاسم بالكامل</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="مثال: الأسطى محمود"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">التخصص / الحرفة</label>
                                <select
                                    value={profession}
                                    onChange={(e) => setProfession(e.target.value)}
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                >
                                    {PROFESSIONS.map((p) => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">القرية / المنطقة</label>
                                <select
                                    value={area}
                                    onChange={(e) => setArea(e.target.value)}
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                >
                                    {SHIBIN_VILLAGES.map((v) => (
                                        <option key={v} value={v}>{v}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">رقم الموبايل</label>
                                <input
                                    type="tel"
                                    required
                                    placeholder="010xxxxxxxx"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">سنوات الخبرة</label>
                                <input
                                    type="number"
                                    min={1}
                                    required
                                    value={experience}
                                    onChange={(e) => setExperience(e.target.value)}
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">نبذة عن أعمالك</label>
                                <input
                                    type="text"
                                    placeholder="مثال: تأسيس وصيانة سباكة حديثة"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition flex items-center gap-2"
                        >
                            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            <span>حفظ ونشر في الدليل</span>
                        </button>
                    </form>
                )}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-8 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative flex items-center">
                        <Search className="w-4 h-4 text-slate-400 absolute right-3" />
                        <select
                            value={selectedProf}
                            onChange={(e) => setSelectedProf(e.target.value)}
                            className="w-full pr-9 pl-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                        >
                            <option value="كل التخصصات">كل التخصصات والحرف</option>
                            {PROFESSIONS.map((p) => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    </div>

                    <div className="relative flex items-center">
                        <MapPin className="w-4 h-4 text-purple-600 absolute right-3" />
                        <select
                            value={selectedArea}
                            onChange={(e) => setSelectedArea(e.target.value)}
                            className="w-full pr-9 pl-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                        >
                            <option value="كل شبين القناطر وقراها">كل شبين القناطر وقراها</option>
                            {SHIBIN_VILLAGES.map((v) => (
                                <option key={v} value={v}>{v}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                    </div>
                ) : filteredCraftsmen.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                        <p className="text-lg font-bold text-slate-800 mb-1">لا يوجد صنايعية مسجلون في هذا القسم حالياً</p>
                        <p className="text-sm text-slate-500">كن أول صنايعي يسجل بياناته في قريتك مجاناً!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCraftsmen.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="px-3 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-extrabold">
                                            {item.profession}
                                        </span>
                                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600">
                                            <MapPin className="w-3.5 h-3.5 text-purple-600" />
                                            {item.area}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-extrabold text-slate-900 mb-1">{item.name}</h3>

                                    <div className="inline-flex items-center gap-1 text-xs text-amber-600 font-semibold mb-3">
                                        <Award className="w-3.5 h-3.5" />
                                        <span>خبرة {item.experience_years} سنوات</span>
                                    </div>

                                    {item.bio && (
                                        <p className="text-xs text-slate-600 leading-relaxed mb-4">{item.bio}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                                    <a
                                        href={"https://wa.me/2" + item.phone}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
                                    >
                                        <MessageCircle className="w-4 h-4 text-emerald-600" />
                                        <span>واتساب</span>
                                    </a>
                                    <a
                                        href={`tel:${item.phone}`}
                                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition"
                                    >
                                        <Phone className="w-4 h-4" />
                                        <span>اتصال مباشر</span>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
