"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { SHIBIN_VILLAGES } from "@/lib/areas";
import { getWhatsAppUrl } from "@/lib/whatsapp";

import {
    ArrowRight,
    Hammer,
    MapPin,
    Phone,
    MessageCircle,
    PlusCircle,
    Search,
    Loader2,
    Image as ImageIcon,
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

interface CraftsmanItem {
    id: string;
    name: string;
    profession: string;
    area: string;
    phone: string;
    description?: string | null;
    image_url?: string | null;
}
export default function CraftsmenPage() {
    const [craftsmen, setCraftsmen] = useState<CraftsmanItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    const [selectedArea, setSelectedArea] = useState("كل شبين القناطر وقراها");
    const [selectedProf, setSelectedProf] = useState("كل المهن");
    const [searchQuery, setSearchQuery] = useState("");
    const [showForm, setShowForm] = useState(false);

    const [name, setName] = useState("");
    const [profession, setProfession] = useState("سباك");
    const [area, setArea] = useState("مدينة شبين القناطر");
    const [phone, setPhone] = useState("");
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
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
    const handleAddCraftsman = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;
        setSubmitting(true);

        let uploadedImageUrl: string | null = null;

        if (imageFile) {
            const fileExt = imageFile.name.split(".").pop();
            const fileName = `craftsman-${userId}-${Date.now()}.${fileExt}`;
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

        const { error } = await supabase.from("craftsmen").insert({
            user_id: userId,
            name: name.trim(),
            profession,
            area,
            phone: phone.trim(),
            image_url: uploadedImageUrl,
        });

        setSubmitting(false);
        if (!error) {
            alert("تم تسجيل بياناتك بنجاح!");
            setShowForm(false);
            setName("");
            setPhone("");
            setDescription("");
            setImageFile(null);
            setImagePreview("");
            fetchCraftsmen();
        } else {
            alert("حدث خطأ أثناء التسجيل: " + error.message);
        }
    };

    const filteredCraftsmen = craftsmen.filter((item) => {
        const matchArea =
            selectedArea === "كل شبين القناطر وقراها" || item.area === selectedArea;
        const matchProf =
            selectedProf === "كل المهن" || item.profession === selectedProf;
        const matchSearch =
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.profession.toLowerCase().includes(searchQuery.toLowerCase());
        return matchArea && matchProf && matchSearch;
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
                                    الصنايعية والحرفيين
                                </h1>
                                <p className="text-sm text-slate-500">
                                    تواصل مباشرة مع أمهر الفنيين والحرفيين في شبين القناطر وقراها
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
                            <span>{showForm ? "إغلاق النموذج" : "سجّل مهنتك مجاناً"}</span>
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold px-5 py-3 rounded-xl transition"
                        >
                            <span>سجّل الدخول لإضافة مهنتك</span>
                        </Link>
                    )}
                </div>

                {showForm && (
                    <form
                        onSubmit={handleAddCraftsman}
                        className="bg-white rounded-2xl border border-purple-200 p-6 mb-8 shadow-md space-y-4"
                    >
                        <h2 className="text-lg font-extrabold text-slate-900">تسجيل صنايعي أو فني جديد</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">الاسم بالكامل</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="مثال: الأسطى محمود حسن"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">المهنة / التخصص</label>
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

                            <div className="sm:col-span-2 lg:col-span-4">
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    صورتك الشخصية أو صورة من أعمالك (اختياري)
                                </label>
                                <div className="flex items-center gap-4 p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="معاينة"
                                            className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
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
                                        className="text-xs text-slate-600 file:ml-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-sm transition"
                        >
                            {submitting ? "جاري الحفظ..." : "حفظ ونشر البيانات"}
                        </button>
                    </form>
                )}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="relative flex items-center">
                        <Search className="w-4 h-4 text-slate-400 absolute right-3" />
                        <input
                            type="text"
                            placeholder="ابحث بالاسم أو المهنة..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pr-9 pl-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                        />
                    </div>

                    <select
                        value={selectedProf}
                        onChange={(e) => setSelectedProf(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700"
                    >
                        <option value="كل المهن">كل المهن</option>
                        {PROFESSIONS.map((p) => (
                            <option key={p} value={p}>{p}</option>
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
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-600" />
                    </div>
                ) : filteredCraftsmen.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                        <p className="text-lg font-bold text-slate-800 mb-1">لا يوجد صنايعية مطابقون لبحثك حالياً</p>
                        <p className="text-sm text-slate-500">جرّب تغيير المهنة أو القرية، أو سجّل مهنتك الآن.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCraftsmen.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                            >
                                <div className="flex items-center gap-3.5 mb-4">
                                    {item.image_url ? (
                                        <img
                                            src={item.image_url}
                                            alt={item.name}
                                            className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                                            <Hammer className="w-8 h-8" />
                                        </div>
                                    )}
                                    <div>
                                        <span className="inline-block px-2.5 py-0.5 rounded-lg bg-purple-50 text-purple-700 text-xs font-bold mb-1">
                                            {item.profession}
                                        </span>
                                        <h3 className="font-extrabold text-slate-900 text-lg leading-snug">
                                            {item.name}
                                        </h3>
                                        <p className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                                            <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                                            <span>{item.area}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                                    <a
                                        href={`tel:${item.phone}`}
                                        className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1 transition"
                                    >
                                        <Phone className="w-3.5 h-3.5" />
                                        <span>اتصال</span>
                                    </a>
                                    <a
                                        href={getWhatsAppUrl(item.phone, `مرحباً ${item.name}`)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1 transition"
                                    >
                                        <MessageCircle className="w-3.5 h-3.5" />
                                        <span>واتساب</span>
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
