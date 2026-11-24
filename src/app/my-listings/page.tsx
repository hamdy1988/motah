"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowRight,
    Trash2,
    PlusCircle,
    MapPin,
    Eye,
    Edit3,
    Loader2,
} from "lucide-react";

interface MyListing {
    id: string;
    title: string;
    listing_type: "rent" | "sale";
    price: number;
    rent_period: string | null;
    area: string;
    image_url: string;
    created_at: string;
}

export default function MyListingsPage() {
    const router = useRouter();
    const [listings, setListings] = useState<MyListing[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        const loadMyListings = async () => {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData.user) {
                router.push("/login");
                return;
            }

            const { data } = await supabase
                .from("listings")
                .select("*")
                .eq("user_id", userData.user.id)
                .order("created_at", { ascending: false });

            if (data) setListings(data);
            setLoading(false);
        };

        loadMyListings();
    }, [router]);

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm("هل أنت متأكد أنك تريد حذف هذا الإعلان نهائياً؟");
        if (!confirmed) return;

        setDeletingId(id);
        const { error } = await supabase.from("listings").delete().eq("id", id);

        if (!error) {
            setListings((prev) => prev.filter((item) => item.id !== id));
        } else {
            alert("حدث خطأ أثناء الحذف: " + error.message);
        }
        setDeletingId(null);
    };
    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <div>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 mb-2"
                        >
                            <ArrowRight className="w-4 h-4" />
                            <span>العودة للرئيسية</span>
                        </Link>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">إعلاناتي المنشورة</h1>
                        <p className="text-sm text-slate-500 mt-1">
                            تحكم في إعلاناتك وعدّل أسعارها أو احذف ما تم بيعه أو تأجيره بسهولة
                        </p>
                    </div>

                    <Link
                        href="/add-listing"
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm transition"
                    >
                        <PlusCircle className="w-4 h-4" />
                        <span>إضافة إعلان جديد</span>
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                    </div>
                ) : listings.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                        <p className="text-lg font-bold text-slate-800 mb-2">لم تقم بنشر أي إعلانات بعد</p>
                        <p className="text-sm text-slate-500 mb-6">
                            ابدأ الآن واعرض عقارك أو سيارتك أو معداتك لأهالي شبين القناطر وقراها مجاناً
                        </p>
                        <Link
                            href="/add-listing"
                            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-5 py-3 rounded-xl transition"
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span>أضف أول إعلان الآن</span>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {listings.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition"
                            >
                                <div className="flex items-center gap-4">
                                    <img
                                        src={item.image_url}
                                        alt={item.title}
                                        className="w-24 h-20 rounded-xl object-cover bg-slate-100 shrink-0"
                                    />
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span
                                                className={`px-2.5 py-0.5 rounded-md text-xs font-bold text-white ${item.listing_type === "rent" ? "bg-emerald-600" : "bg-blue-600"
                                                    }`}
                                            >
                                                {item.listing_type === "rent" ? "للإيجار" : "للبيع"}
                                            </span>
                                            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                                                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                                                {item.area}
                                            </span>
                                        </div>

                                        <h2 className="font-bold text-slate-900 text-base line-clamp-1">
                                            {item.title}
                                        </h2>

                                        <p className="text-sm font-extrabold text-emerald-700 mt-1">
                                            {Number(item.price).toLocaleString()} ج.م
                                            {item.rent_period && (
                                                <span className="text-xs font-normal text-slate-500 mr-1">
                                                    / {item.rent_period}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                                    <Link
                                        href={`/listing/${item.id}`}
                                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
                                    >
                                        <Eye className="w-4 h-4" />
                                        <span>عرض</span>
                                    </Link>

                                    <Link
                                        href={`/edit-listing/${item.id}`}
                                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold transition"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                        <span>تعديل</span>
                                    </Link>

                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        disabled={deletingId === item.id}
                                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition"
                                    >
                                        {deletingId === item.id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                        <span>حذف</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
