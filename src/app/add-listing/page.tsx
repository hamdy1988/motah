"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Upload, Loader2, CheckCircle } from "lucide-react";

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

export default function AddListingPage() {
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [listingType, setListingType] = useState<"rent" | "sale">("rent");
    const [category, setCategory] = useState<"real_estate" | "vehicles" | "equipment">("real_estate");
    const [price, setPrice] = useState("");
    const [rentPeriod, setRentPeriod] = useState("شهرياً");
    const [area, setArea] = useState("مدينة شبين القناطر");
    const [phone, setPhone] = useState("");
    const [specsText, setSpecsText] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (!data.user) {
                router.push("/login");
            } else {
                setUserId(data.user.id);
            }
        });
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;
        setLoading(true);

        let uploadedImageUrl = "https://unsplash.com";

        if (imageFile) {
            const fileExt = imageFile.name.split(".").pop();
            const fileName = `${Date.now()}.${fileExt}`;
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

        const specsArray = specsText
            .split("،")
            .map((s) => s.trim())
            .filter((s) => s !== "");

        const { error } = await supabase.from("listings").insert({
            user_id: userId,
            title,
            description,
            listing_type: listingType,
            category,
            price: Number(price),
            rent_period: listingType === "rent" ? rentPeriod : null,
            area,
            phone,
            specs: specsArray,
            image_url: uploadedImageUrl,
        });

        setLoading(false);

        if (error) {
            alert("حدث خطأ أثناء نشر الإعلان: " + error.message);
        } else {
            router.push("/");
            router.refresh();
        }
    };
    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sm:p-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 mb-6"
                >
                    <ArrowRight className="w-4 h-4" />
                    <span>العودة للرئيسية</span>
                </Link>

                <h1 className="text-2xl font-extrabold text-slate-900 mb-2">أضف إعلانك مجاناً على مُتاح</h1>
                <p className="text-sm text-slate-500 mb-6">
                    اعرض عقارك أو سيارتك أو معداتك للبيع أو الإيجار لأهالي شبين القناطر وقراها
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setListingType("rent")}
                            className={`py-3 rounded-xl font-bold text-sm border transition ${listingType === "rent"
                                    ? "bg-emerald-600 text-white border-emerald-600"
                                    : "bg-slate-50 text-slate-700 border-slate-200"
                                }`}
                        >
                            للإيجار
                        </button>
                        <button
                            type="button"
                            onClick={() => setListingType("sale")}
                            className={`py-3 rounded-xl font-bold text-sm border transition ${listingType === "sale"
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-slate-50 text-slate-700 border-slate-200"
                                }`}
                        >
                            للبيع
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">القسم</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value as "real_estate" | "vehicles" | "equipment")}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                            >
                                <option value="real_estate">عقارات وأراضي</option>
                                <option value="vehicles">سيارات ومركبات</option>
                                <option value="equipment">معدات وأجهزة</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">المدينة / القرية</label>
                            <select
                                value={area}
                                onChange={(e) => setArea(e.target.value)}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                            >
                                {SHIBIN_AREAS.map((a) => (
                                    <option key={a} value={a}>{a}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">عنوان الإعلان</label>
                        <input
                            type="text"
                            required
                            placeholder="مثال: شقة 120 متر سوبر لوكس للإيجار بجوار المحطة"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">السعر (بالجنيه المصري)</label>
                            <input
                                type="number"
                                required
                                placeholder="مثال: 3500"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                            />
                        </div>

                        {listingType === "rent" && (
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">نظام الإيجار</label>
                                <select
                                    value={rentPeriod}
                                    onChange={(e) => setRentPeriod(e.target.value)}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                >
                                    <option value="يومياً">يومياً</option>
                                    <option value="أسبوعياً">أسبوعياً</option>
                                    <option value="شهرياً">شهرياً</option>
                                    <option value="سنوياً">سنوياً</option>
                                </select>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">رقم الموبايل (واتساب / اتصال)</label>
                        <input
                            type="tel"
                            required
                            placeholder="010xxxxxxxx"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                            مميزات ومواصفات سريعة (افصل بينها بفاصلة ،)
                        </label>
                        <input
                            type="text"
                            placeholder="مثال: 3 غرف ، الدور الثاني ، تشطيب حديث"
                            value={specsText}
                            onChange={(e) => setSpecsText(e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">تفاصيل إضافية</label>
                        <textarea
                            rows={3}
                            placeholder="اكتب كل التفاصيل التي تهم المستأجر أو المشتري..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">صورة الإعلان</label>
                        <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition">
                            <Upload className="w-6 h-6 text-emerald-600 mb-2" />
                            <span className="text-sm font-medium text-slate-700">
                                {imageFile ? imageFile.name : "اضغط هنا لاختيار صورة من جهازك"}
                            </span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                className="hidden"
                            />
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                        <span>{loading ? "جاري نشر الإعلان..." : "نشر الإعلان الآن"}</span>
                    </button>
                </form>
            </div>
        </div>
    );
}
