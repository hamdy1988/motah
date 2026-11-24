"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
    ArrowRight,
    MapPin,
    Phone,
    MessageCircle,
    Calendar,
    CheckCircle2,
    User,
    Share2,
    Loader2,
    Send,
} from "lucide-react";

interface ListingDetail {
    id: string;
    user_id: string;
    title: string;
    description: string | null;
    listing_type: "rent" | "sale";
    category: string;
    price: number;
    rent_period: string | null;
    area: string;
    phone: string;
    specs: string[];
    image_url: string;
    is_verified: boolean;
    created_at: string;
}

interface OwnerProfile {
    full_name: string;
    area: string;
}

export default function ListingDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [listing, setListing] = useState<ListingDetail | null>(null);
    const [owner, setOwner] = useState<OwnerProfile | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    const [msgText, setMsgText] = useState("");
    const [sendingMsg, setSendingMsg] = useState(false);
    const [msgSent, setMsgSent] = useState(false);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setCurrentUserId(data.user?.id || null);
        });

        if (!id) return;

        const fetchDetails = async () => {
            const { data: listingData } = await supabase
                .from("listings")
                .select("*")
                .eq("id", id)
                .single();

            if (listingData) {
                setListing(listingData);
                const { data: profileData } = await supabase
                    .from("profiles")
                    .select("full_name, area")
                    .eq("id", listingData.user_id)
                    .single();

                if (profileData) setOwner(profileData);
            }
            setLoading(false);
        };

        fetchDetails();
    }, [id]);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUserId) {
            router.push("/login");
            return;
        }
        if (!listing || !msgText.trim()) return;

        setSendingMsg(true);
        const { error } = await supabase.from("messages").insert({
            listing_id: listing.id,
            sender_id: currentUserId,
            receiver_id: listing.user_id,
            content: msgText.trim(),
        });

        setSendingMsg(false);
        if (!error) {
            setMsgText("");
            setMsgSent(true);
            setTimeout(() => setMsgSent(false), 3000);
        }
    };
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    if (!listing) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">عذراً، هذا الإعلان غير موجود</h1>
                <p className="text-slate-500 mb-6">ربما تم حذفه أو انتهى العرض.</p>
                <Link
                    href="/"
                    className="px-5 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl"
                >
                    العودة للصفحة الرئيسية
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900"
                    >
                        <ArrowRight className="w-4 h-4" />
                        <span>العودة لجميع العروض</span>
                    </Link>

                    <button
                        onClick={handleShare}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                    >
                        <Share2 className="w-4 h-4 text-emerald-600" />
                        <span>{copied ? "تم نسخ رابط الإعلان!" : "مشاركة الإعلان"}</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                            <div className="relative aspect-[16/10] bg-slate-100">
                                <img
                                    src={listing.image_url}
                                    alt={listing.title}
                                    className="w-full h-full object-cover"
                                />
                                <span
                                    className={`absolute top-4 right-4 px-4 py-1.5 rounded-xl text-sm font-bold text-white shadow ${listing.listing_type === "rent" ? "bg-emerald-600" : "bg-blue-600"
                                        }`}
                                >
                                    {listing.listing_type === "rent" ? "للإيجار" : "للبيع"}
                                </span>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center gap-3 text-sm text-slate-500 mb-3">
                                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg">
                                        <MapPin className="w-4 h-4" />
                                        {listing.area}
                                    </span>
                                    {listing.is_verified && (
                                        <span className="inline-flex items-center gap-1 text-blue-600 font-semibold">
                                            <CheckCircle2 className="w-4 h-4" />
                                            إعلان موثق
                                        </span>
                                    )}
                                </div>

                                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">
                                    {listing.title}
                                </h1>

                                {listing.specs && listing.specs.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {listing.specs.map((spec, idx) => (
                                            <span
                                                key={idx}
                                                className="text-sm bg-slate-100 text-slate-700 font-medium px-3 py-1.5 rounded-lg"
                                            >
                                                {spec}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="border-t border-slate-100 pt-5">
                                    <h2 className="text-lg font-bold text-slate-900 mb-2">التفاصيل والوصف</h2>
                                    <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                                        {listing.description || "لا توجد تفاصيل إضافية مكتوبة لهذا الإعلان."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24">
                            <p className="text-sm text-slate-500 mb-1">السعر المطلوب</p>
                            <div className="flex items-baseline gap-1.5 mb-6">
                                <span className="text-3xl font-extrabold text-slate-900">
                                    {Number(listing.price).toLocaleString()} ج.م
                                </span>
                                {listing.rent_period && (
                                    <span className="text-sm text-slate-500">/ {listing.rent_period}</span>
                                )}
                            </div>

                            <div className="space-y-3 mb-6">
                                <a
                                    href={`https://wa.me{listing.phone}?text=${encodeURIComponent(`مرحباً، أود حجز موعد معاينة بخصوص إعلانك على منصة مُتاح: ${listing.title}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition"
                                >
                                    <Calendar className="w-4 h-4 text-emerald-400" />
                                    <span>حجز موعد معاينة</span>
                                </a>

                                <a
                                    href={`https://wa.me{listing.phone}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    <span>تواصل عبر واتساب</span>
                                </a>

                                <a
                                    href={`tel:${listing.phone}`}
                                    className="w-full py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-sm flex items-center justify-center gap-2 transition"
                                >
                                    <Phone className="w-4 h-4 text-emerald-600" />
                                    <span>اتصال مباشر ({listing.phone})</span>
                                </a>
                            </div>

                            {currentUserId !== listing.user_id && (
                                <form onSubmit={handleSendMessage} className="border-t border-slate-100 pt-4 mb-5">
                                    <label className="block text-xs font-bold text-slate-700 mb-2">
                                        أرسل رسالة داخلية للمُعلن
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            required
                                            placeholder="اكتب استفسارك هنا..."
                                            value={msgText}
                                            onChange={(e) => setMsgText(e.target.value)}
                                            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                        <button
                                            type="submit"
                                            disabled={sendingMsg}
                                            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition"
                                        >
                                            {sendingMsg ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Send className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                    {msgSent && (
                                        <p className="text-xs text-emerald-600 font-semibold mt-2">
                                            تم إرسال رسالتك بنجاح! ستجد الرد في صفحة الرسائل.
                                        </p>
                                    )}
                                </form>
                            )}

                            <div className="border-t border-slate-100 pt-4 flex items-center gap-3">
                                <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400">المُعلن</p>
                                    <p className="font-bold text-slate-900 text-sm">
                                        {owner?.full_name || "عضو في منصة مُتاح"}
                                    </p>
                                    <p className="text-xs text-emerald-600">
                                        {owner?.area || listing.area}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
