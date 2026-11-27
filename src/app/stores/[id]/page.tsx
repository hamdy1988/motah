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
    MessageCircle,
    PlusCircle,
    Search,
    Loader2,
    Image as ImageIcon,
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
    image_url?: string | null;
}
export default function StoresPage() {
    const [stores, setStores] = useState<StoreItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    const [selectedArea, setSelectedArea] = useState("كل شبين القناطر وقراها");
    const [selectedCat, setSelectedCat] = useState("كل التصنيفات");
    const [searchQuery, setSearchQuery] = useState("");
    const [showForm, setShowForm] = useState(false);

    const [name, setName] = useState("");
    const [category, setCategory] = useState("سوبر ماركت وبقالة");
    const [area, setArea] = useState("مدينة شبين القناطر");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
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
    const handleAddStore = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;
        setSubmitting(true);

        let uploadedImageUrl: string | null = null;

        if (imageFile) {
            const fileExt = imageFile.name.split(".").pop();
            const fileName = `store-logo-${userId}-${Date.now()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from("listings-images")
                .upload(fileName, imageFile);

            if (!uploadError) {
                const { data: publicUrlData } = supabase.storage
                    .from("listings-images")
                    .getPublicUrl(fileName);
                uploadedImageUrl = publicUrlData.publicUrl;
            }
        }

        const { error } = await supabase.from("stores").insert({
            user_id: userId,
            name: name.trim(),
            category,
            area,
            address: address.trim() || null,
            phone: phone.trim(),
            description: description.trim() || null,
            image_url: uploadedImageUrl,
        });

        setSubmitting(false);
        if (!error) {
            alert("تمت إضافة متجرك بنجاح!");
            setShowForm(false);
            setName("");
            setAddress("");
            setPhone("");
            setDescription("");
            setImageFile(null);
            setImagePreview("");
            fetchStores();
        } else {
            alert("حدث خطأ أثناء الإضافة: " + error.message);
        }
    };

    const filteredStores = stores.filter((st) => {
        const matchArea =
            selectedArea === "كل شبين القناطر وقراها" || st.area === selectedArea;
        const matchCat =
            selectedCat === "كل التصنيفات" || st.category === selectedCat;
        const matchSearch =
            st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (st.address || "").toLowerCase().includes(searchQuery.toLowerCase());
        return matchArea && matchCat && matchSearch;
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
                                    تصفح محلات ومتاجر شبين القناطر وقراها وتواصل معهم مباشرة
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
                            <span>{showForm ? "إغلاق النموذج" : "أضف متجرك مجاناً"}</span>
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
                        onSubmit={handleAddStore}
                        className="bg-white rounded-2xl border border-amber-200 p-6 mb-8 shadow-md space-y-4"
                    >
                        <h2 className="text-lg font-extrabold text-slate-900">إضافة متجر أو محل جديد</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">اسم المتجر أو المحل</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="مثال: ماركت البركة"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">التصنيف</label>
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
                                    {SHIBIN_VILLAGES.filter((v) => v !== "كل شبين القناطر وقراها").map((v) => (
                                        <option key={v} value={v}>{v}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">العنوان بالتفصيل</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="مثال: بجوار موقف شبين القناطر"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">رقم الهاتف / الواتساب</label>
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
                                <label className="block text-xs font-bold text-slate-700 mb-1">نبذة عن المحل (اختياري)</label>
                                <input
                                    type="text"
                                    placeholder="مثال: خدمة توصيل مجانية داخل المدينة"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                />
                            </div>

                            <div className="sm:col-span-2 lg:col-span-3">
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    لوجو المحل أو صورة الواجهة (اختياري)
                                </label>
                                <div className="flex items-center gap-4 p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="معاينة"
                                            className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                                            <ImageIcon className="w-6 h-6" />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const files = e.target.files;
                                            if (files && files.length > 0) {
                                                setImageFile(files[0]);
                                                setImagePreview(URL.createObjectURL(files[0]));
                                            }
                                        }}
                                        className="text-xs text-slate-600 file:ml-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-white hover:file:bg-amber-600 cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-sm transition"
                        >
                            {submitting ? "جاري الحفظ..." : "حفظ ونشر المتجر"}
                        </button>
                    </form>
                )}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="relative flex items-center">
                        <Search className="w-4 h-4 text-slate-400 absolute right-3" />
                        <input
                            type="text"
                            placeholder="ابحث باسم المحل أو العنوان..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pr-9 pl-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                        />
                    </div>

                    <select
                        value={selectedCat}
                        onChange={(e) => setSelectedCat(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700"
                    >
                        <option value="كل التصنيفات">كل التصنيفات</option>
                        {STORE_CATEGORIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>

                    <select
                        value={selectedArea}
                        onChange={(e) => setSelectedArea(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700"
                    >
                        <option value="كل شبين القناطر وقراها">كل شبين القناطر وقراها</option>
                        {SHIBIN_VILLAGES.filter((v) => v !== "كل شبين القناطر وقراها").map((v) => (
                            <option key={v} value={v}>{v}</option>
                        ))}
                    </select>
                </div>
                {loading ? (
                    <div className="py-16 text-center text-slate-400">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-500" />
                    </div>
                ) : filteredStores.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                        <p className="text-lg font-bold text-slate-800 mb-1">لا توجد متاجر مطابقة لبحثك حالياً</p>
                        <p className="text-sm text-slate-500">جرّب تغيير التصنيف أو المنطقة، أو أضف متجرك الآن.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredStores.map((st) => (
                            <div
                                key={st.id}
                                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center gap-3.5 mb-4">
                                        {st.image_url ? (
                                            <img
                                                src={st.image_url}
                                                alt={st.name}
                                                className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                                                <Store className="w-8 h-8" />
                                            </div>
                                        )}
                                        <div>
                                            <span className="inline-block px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-700 text-xs font-bold mb-1">
                                                {st.category}
                                            </span>
                                            <h3 className="font-extrabold text-slate-900 text-lg leading-snug">
                                                {st.name}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-xs text-slate-600 mb-4">
                                        <p className="flex items-center gap-1.5">
                                            <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                                            <span>{st.area} {st.address ? `- ${st.address}` : ""}</span>
                                        </p>
                                        {st.description && (
                                            <p className="text-slate-500 line-clamp-2">{st.description}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2 pt-3 border-t border-slate-100">
                                    <Link
                                        href={`/stores/${st.id}`}
                                        className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        <span>تصفح منتجات وعروض المتجر</span>
                                    </Link>

                                    <div className="grid grid-cols-2 gap-2">
                                        <a
                                            href={`tel:${st.phone}`}
                                            className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1 transition"
                                        >
                                            <Phone className="w-3.5 h-3.5" />
                                            <span>اتصال</span>
                                        </a>
                                        <a
                                            href={`https://wa.me{st.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`مرحباً ${st.name}، أتواصل معكم عبر منصة مُتاح`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1 transition"
                                        >
                                            <MessageCircle className="w-3.5 h-3.5" />
                                            <span>واتساب</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
