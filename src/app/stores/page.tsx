"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { SHIBIN_VILLAGES } from "@/lib/areas";
import {
    ArrowRight,
    Store,
    MapPin,
    Phone,
    PlusCircle,
    Search,
    Loader2,
    ExternalLink,
} from "lucide-react";

const STORE_CATEGORIES = [
    "سوبر ماركت وبقالة",
    "ملابس وأحذية",
    "موبايلات وإلكترونيات",
    "أدوات منزلية ومفروشات",
    "مطاعم وكافيهات",
    "صيدليات ومستحضرات تجميل",
    "قطع غيار سيارات",
    "مكتبات وأدوات مدرسية",
    "محلات أخرى",
];

interface StoreItem {
    id: string;
    name: string;
    category: string;
    area: string;
    address: string | null;
    phone: string;
    description: string | null;
}

export default function StoresPage() {
    const [stores, setStores] = useState<StoreItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    const [selectedArea, setSelectedArea] = useState("كل شبين القناطر وقراها");
    const [selectedCat, setSelectedCat] = useState("كل التخصصات");
    const [showForm, setShowForm] = useState(false);

    const [name, setName] = useState("");
    const [category, setCategory] = useState("سوبر ماركت وبقالة");
    const [area, setArea] = useState("مدينة شبين القناطر");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [description, setDescription] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const fetchStores = async () => {
        const { data } = await supabase
            .from("stores")
            .select("*")
            .order("created_at", { ascending: false });
        if (data) setStores(data);
        setLoading(false);
    };

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUserId(data.user?.id || null);
        });
        fetchStores();
    }, []);

    const handleCreateStore = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;
        setSubmitting(true);

        const { error } = await supabase.from("stores").insert({
            user_id: userId,
            name,
            category,
            area,
            address,
            phone,
            description,
        });

        setSubmitting(false);
        if (!error) {
            setShowForm(false);
            setName("");
            setAddress("");
            setPhone("");
            setDescription("");
            fetchStores();
        } else {
            alert("حدث خطأ: " + error.message);
        }
    };
    const filteredStores = stores.filter((item) => {
        const matchArea =
            selectedArea === "كل شبين القناطر وقراها" || item.area === selectedArea;
        const matchCat =
            selectedCat === "كل التخصصات" || item.category === selectedCat;
        return matchArea && matchCat;
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
                            <div className="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
                                <Store className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                                    المتاجر والمحلات
                                </h1>
                                <p className="text-sm text-slate-500">
                                    تصفح محلات شبين القناطر وقراها وشاهد منتجات كل متجر وعروضه
                                </p>
                            </div>
                        </div>
                    </div>

                    {userId ? (
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold px-5 py-3 rounded-xl shadow-sm transition"
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span>{showForm ? "إغلاق النموذج" : "افتح صفحة لمتجرك مجاناً"}</span>
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold px-5 py-3 rounded-xl transition"
                        >
                            <span>سجّل الدخول لإضافة متجرك</span>
                        </Link>
                    )}
                </div>

                {showForm && (
                    <form
                        onSubmit={handleCreateStore}
                        className="bg-white rounded-2xl border border-amber-200 p-6 mb-8 shadow-md space-y-4"
                    >
                        <h2 className="text-lg font-extrabold text-slate-900">إنشاء صفحة متجر جديد</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">اسم المتجر / المحل</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="مثال: سنتر النور للأدوات المنزلية"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">نشاط المتجر</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                >
                                    {STORE_CATEGORIES.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">المدينة / القرية</label>
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
                                <label className="block text-xs font-bold text-slate-700 mb-1">العنوان بالتفصيل</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="مثال: شارع المحطة بجوار البنك"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">رقم تواصل المتجر</label>
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
                                <label className="block text-xs font-bold text-slate-700 mb-1">وصف قصير للمتجر</label>
                                <input
                                    type="text"
                                    placeholder="مثال: جميع المستلزمات بأفضل الأسعار"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-xl transition flex items-center gap-2"
                        >
                            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            <span>إنشاء المتجر الآن</span>
                        </button>
                    </form>
                )}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-8 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative flex items-center">
                        <Search className="w-4 h-4 text-slate-400 absolute right-3" />
                        <select
                            value={selectedCat}
                            onChange={(e) => setSelectedCat(e.target.value)}
                            className="w-full pr-9 pl-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                        >
                            <option value="كل التخصصات">كل الأنشطة التجارية</option>
                            {STORE_CATEGORIES.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    <div className="relative flex items-center">
                        <MapPin className="w-4 h-4 text-amber-500 absolute right-3" />
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
                        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                    </div>
                ) : filteredStores.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                        <p className="text-lg font-bold text-slate-800 mb-1">لا توجد متاجر مسجلة في هذا القسم حالياً</p>
                        <p className="text-sm text-slate-500">كن أول صاحب محل يفتح صفحة لمتجره مجاناً!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredStores.map((store) => (
                            <div
                                key={store.id}
                                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="px-3 py-1 rounded-lg bg-amber-50 text-amber-700 text-xs font-extrabold">
                                            {store.category}
                                        </span>
                                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600">
                                            <MapPin className="w-3.5 h-3.5 text-amber-500" />
                                            {store.area}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-extrabold text-slate-900 mb-1">{store.name}</h3>
                                    {store.address && (
                                        <p className="text-xs text-slate-500 mb-2">{store.address}</p>
                                    )}
                                    {store.description && (
                                        <p className="text-xs text-slate-600 leading-relaxed mb-4">{store.description}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                                    <Link
                                        href={`/stores/${store.id}`}
                                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
                                    >
                                        <ExternalLink className="w-4 h-4 text-amber-400" />
                                        <span>دخول المتجر</span>
                                    </Link>
                                    <a
                                        href={`tel:${store.phone}`}
                                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition"
                                    >
                                        <Phone className="w-4 h-4" />
                                        <span>اتصال</span>
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
