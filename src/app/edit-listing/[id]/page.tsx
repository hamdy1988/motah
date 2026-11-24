"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { SHIBIN_VILLAGES } from "@/lib/areas";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2, Save } from "lucide-react";

export default function EditListingPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [listingType, setListingType] = useState<"rent" | "sale">("rent");
    const [category, setCategory] = useState<"real_estate" | "vehicles" | "equipment">("real_estate");
    const [price, setPrice] = useState("");
    const [rentPeriod, setRentPeriod] = useState("شهرياً");
    const [area, setArea] = useState("مدينة شبين القناطر");
    const [phone, setPhone] = useState("");
    const [specsText, setSpecsText] = useState("");

    useEffect(() => {
        const loadListing = async () => {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData.user) {
                router.push("/login");
                return;
            }

            const { data } = await supabase
                .from("listings")
                .select("*")
                .eq("id", id)
                .eq("user_id", userData.user.id)
                .single();

            if (!data) {
                router.push("/my-listings");
                return;
            }

            setTitle(data.title);
            setDescription(data.description || "");
            setListingType(data.listing_type);
            setCategory(data.category);
            setPrice(String(data.price));
            setRentPeriod(data.rent_period || "شهرياً");
            setArea(data.area);
            setPhone(data.phone);
            setSpecsText(data.specs ? data.specs.join(" ، ") : "");
            setLoading(false);
        };

        if (id) loadListing();
    }, [id, router]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const specsArray = specsText
            .split("،")
            .map((s) => s.trim())
            .filter((s) => s !== "");

        const { error } = await supabase
            .from("listings")
            .update({
                title,
                description,
                listing_type: listingType,
                category,
                price: Number(price),
                rent_period: listingType === "rent" ? rentPeriod : null,
                area,
                phone,
                specs: specsArray,
            })
            .eq("id", id);

        setSaving(false);

        if (error) {
            alert("حدث خطأ أثناء التحديث: " + error.message);
        } else {
            router.push("/my-listings");
            router.refresh();
        }
    };
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sm:p-8">
                <Link
                    href="/my-listings"
                    className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 mb-6"
                >
                    <ArrowRight className="w-4 h-4" />
                    <span>العودة لإعلاناتي</span>
                </Link>

                <h1 className="text-2xl font-extrabold text-slate-900 mb-2">تعديل بيانات الإعلان</h1>
                <p className="text-sm text-slate-500 mb-6">
                    عدّل السعر أو التفاصيل ثم اضغط على حفظ التعديلات
                </p>

                <form onSubmit={handleUpdate} className="space-y-5">
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
                                {SHIBIN_VILLAGES.map((a) => (
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
                            value={specsText}
                            onChange={(e) => setSpecsText(e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">تفاصيل إضافية</label>
                        <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        <span>{saving ? "جاري حفظ التعديلات..." : "حفظ التعديلات"}</span>
                    </button>
                </form>
            </div>
        </div>
    );
}
