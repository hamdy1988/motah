"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { SHIBIN_VILLAGES } from "@/lib/areas";
import { LISTING_CATEGORIES } from "@/lib/categories";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowRight,
    Loader2,
    CheckCircle,
    Tag,
    MapPin,
    Phone,
    Image as ImageIcon,
} from "lucide-react";

export default function AddListingPage() {
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [listingType, setListingType] = useState<"rent" | "sale">("sale");
    const [category, setCategory] = useState<string>("عقارات وأراضي");
    const [price, setPrice] = useState("");
    const [rentPeriod, setRentPeriod] = useState("شهرياً");
    const [area, setArea] = useState("مدينة شبين القناطر");
    const [phone, setPhone] = useState("");
    const [specsInput, setSpecsInput] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (!data.user) {
                router.push("/login");
            } else {
                setUserId(data.user.id);
            }
        });
    }, [router]);
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setImageFile(files[0]);
            setImagePreview(URL.createObjectURL(files[0]));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;
        setLoading(true);

        let uploadedImageUrl =
            "https://unsplash.com";

        if (imageFile) {
            const fileExt = imageFile.name.split(".").pop();
            const fileName = `${userId}-${Date.now()}.${fileExt}`;
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

        const specsArray = specsInput
            .split("،")
            .map((s) => s.trim())
            .filter(Boolean);

        const { error } = await supabase.from("listings").insert({
            user_id: userId,
            title: title.trim(),
            description: description.trim() || null,
            listing_type: listingType,
            category,
            price: Number(price),
            rent_period: listingType === "rent" ? rentPeriod : null,
            area,
            phone: phone.trim(),
            specs: specsArray,
            image_url: uploadedImageUrl,
            is_verified: false,
        });

        setLoading(false);

        if (!error) {
            alert("تم نشر إعلانك بنجاح!");
            router.push("/");
        } else {
            alert("حدث خطأ أثناء نشر الإعلان: " + error.message);
        }
    };
    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 mb-4"
                >
                    <ArrowRight className="w-4 h-4" />
                    <span>العودة للرئيسية</span>
                </Link>

                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-100">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                            <Tag className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold text-slate-900">
                                أضف إعلانك مجاناً
                            </h1>
                            <p className="text-sm text-slate-500">
                                اعرض عقارك، سيارتك، أو أي غرض للبيع أو الإيجار في شبين القناطر وقراها
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                نوع الإعلان
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setListingType("sale")}
                                    className={`py-3 rounded-xl text-sm font-extrabold border transition ${listingType === "sale"
                                            ? "bg-sky-600 text-white border-sky-600 shadow-xs"
                                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                                        }`}
                                >
                                    للبيع
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setListingType("rent")}
                                    className={`py-3 rounded-xl text-sm font-extrabold border transition ${listingType === "rent"
                                            ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                                        }`}
                                >
                                    للإيجار
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">
                                عنوان الإعلان
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="مثال: شقة 120 متر تشطيب سوبر لوكس بشارع بورسعيد"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                                    القسم
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    {LISTING_CATEGORIES.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                                    المدينة أو القرية
                                </label>
                                <div className="relative flex items-center">
                                    <MapPin className="w-4 h-4 text-emerald-600 absolute right-3" />
                                    <select
                                        value={area}
                                        onChange={(e) => setArea(e.target.value)}
                                        className="w-full pr-9 pl-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        {SHIBIN_VILLAGES.filter(
                                            (v) => v !== "كل شبين القناطر وقراها"
                                        ).map((v) => (
                                            <option key={v} value={v}>
                                                {v}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                                    السعر (بالجنيه المصري)
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    placeholder="مثال: 2500"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            {listingType === "rent" ? (
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">
                                        نظام الإيجار
                                    </label>
                                    <select
                                        value={rentPeriod}
                                        onChange={(e) => setRentPeriod(e.target.value)}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="شهرياً">شهرياً</option>
                                        <option value="يومياً">يومياً</option>
                                        <option value="سنوياً">سنوياً</option>
                                    </select>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">
                                        رقم الهاتف / الواتساب للتواصل
                                    </label>
                                    <div className="relative flex items-center">
                                        <Phone className="w-4 h-4 text-slate-400 absolute right-3" />
                                        <input
                                            type="tel"
                                            required
                                            placeholder="010xxxxxxxx"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full pr-9 pl-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {listingType === "rent" && (
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                                    رقم الهاتف / الواتساب للتواصل
                                </label>
                                <div className="relative flex items-center">
                                    <Phone className="w-4 h-4 text-slate-400 absolute right-3" />
                                    <input
                                        type="tel"
                                        required
                                        placeholder="010xxxxxxxx"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full pr-9 pl-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">
                                مميزات ومواصفات سريعة (اختياري - افصل بينها بفاصلة ،)
                            </label>
                            <input
                                type="text"
                                placeholder="مثال: الدور الثالث، عداد كهرباء، غاز طبيعي، واجهة بحري"
                                value={specsInput}
                                onChange={(e) => setSpecsInput(e.target.value)}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">
                                تفاصيل ووصف الإعلان
                            </label>
                            <textarea
                                rows={4}
                                placeholder="اكتب كل التفاصيل المهمة عن الإعلان والموقع بدقة..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">
                                صورة الإعلان
                            </label>
                            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl cursor-pointer bg-slate-50 hover:bg-emerald-50/30 transition overflow-hidden">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="معاينة"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-slate-500">
                                        <ImageIcon className="w-8 h-8 text-emerald-600 mb-2" />
                                        <span className="text-sm font-bold">
                                            اضغط لاختيار صورة واضحة من جهازك
                                        </span>
                                        <span className="text-xs text-slate-400 mt-1">
                                            PNG, JPG أو WEBP
                                        </span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-extrabold text-base rounded-2xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>جاري نشر الإعلان...</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5" />
                                    <span>نشر الإعلان الآن</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
