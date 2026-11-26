"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
    ShieldCheck,
    Tag,
    Stethoscope,
    Store,
    Wrench,
    Trash2,
    PlusCircle,
    ExternalLink,
    Loader2,
    Lock,
    Search,
} from "lucide-react";

const ADMIN_EMAIL = "hamdy_etman1988@yahoo.com";

export default function AdminDashboardPage() {
    const [authorized, setAuthorized] = useState<boolean | null>(null);
    const [activeTab, setActiveTab] = useState<"listings" | "doctors" | "stores" | "craftsmen">("listings");
    const [searchQuery, setSearchQuery] = useState("");

    const [stats, setStats] = useState({ listings: 0, doctors: 0, stores: 0, craftsmen: 0, appointments: 0 });
    const [items, setItems] = useState<any[]>([]);
    const [loadingData, setLoadingData] = useState(false);

    const [showAddDoctor, setShowAddDoctor] = useState(false);
    const [docForm, setDocForm] = useState({
        doctor_name: "",
        specialty: "باطنة وجهاز هضمي",
        area: "مدينة شبين القناطر",
        address: "",
        phone: "",
        fee: 150,
        working_hours: "يومياً من 5 مساءً إلى 10 مساءً",
    });

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            const email = data.user?.email;
            if (email && email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
                setAuthorized(true);
                loadAllStats();
                loadTabData("listings");
            } else {
                setAuthorized(false);
            }
        });
    }, []);
    const loadAllStats = async () => {
        const [l, d, s, c, a] = await Promise.all([
            supabase.from("listings").select("id", { count: "exact", head: true }),
            supabase.from("doctors").select("id", { count: "exact", head: true }),
            supabase.from("stores").select("id", { count: "exact", head: true }),
            supabase.from("craftsmen").select("id", { count: "exact", head: true }),
            supabase.from("appointments").select("id", { count: "exact", head: true }),
        ]);
        setStats({
            listings: l.count || 0,
            doctors: d.count || 0,
            stores: s.count || 0,
            craftsmen: c.count || 0,
            appointments: a.count || 0,
        });
    };

    const loadTabData = async (tab: "listings" | "doctors" | "stores" | "craftsmen") => {
        setActiveTab(tab);
        setLoadingData(true);
        const { data } = await supabase
            .from(tab)
            .select("*")
            .order("created_at", { ascending: false })
            .limit(50);
        setItems(data || []);
        setLoadingData(false);
    };

    const handleDelete = async (id: string) => {
        const ok = window.confirm("هل أنت متأكد من حذف هذا العنصر نهائياً؟");
        if (!ok) return;

        const { error } = await supabase.from(activeTab).delete().eq("id", id);
        if (!error) {
            setItems((prev) => prev.filter((item) => item.id !== id));
            loadAllStats();
        } else {
            alert("حدث خطأ أثناء الحذف: " + error.message);
        }
    };

    const handleAddDoctor = async (e: React.FormEvent) => {
        e.preventDefault();
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return;

        const { error } = await supabase.from("doctors").insert({
            ...docForm,
            user_id: userData.user.id,
            current_serving_number: 0,
        });

        if (!error) {
            alert("تمت إضافة العيادة بنجاح!");
            setShowAddDoctor(false);
            setDocForm({ ...docForm, doctor_name: "", address: "", phone: "" });
            loadAllStats();
            loadTabData("doctors");
        } else {
            alert("خطأ في الإضافة: " + error.message);
        }
    };
    if (authorized === null) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
            </div>
        );
    }

    if (authorized === false) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
                    <Lock className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 mb-2">منطقة محظورة</h1>
                <p className="text-sm text-slate-500 mb-6">
                    هذه الصفحة مخصصة لإدارة منصة مُتاح فقط.
                </p>
                <Link href="/" className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-sm">
                    العودة للصفحة الرئيسية
                </Link>
            </div>
        );
    }

    const filteredItems = items.filter((item) => {
        const text = `${item.title || ""} ${item.doctor_name || ""} ${item.name || ""} ${item.area || ""}`.toLowerCase();
        return text.includes(searchQuery.toLowerCase());
    });

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            <div className="bg-slate-900 text-white py-6 px-4 shadow-md">
                <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-extrabold flex items-center gap-2">
                                <span>غرفة تحكم منصة مُتاح</span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300">Admin</span>
                            </h1>
                            <p className="text-xs text-slate-400">إدارة المحتوى، العيادات، والمتاجر في شبين القناطر</p>
                        </div>
                    </div>
                    <Link
                        href="/"
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1.5 transition"
                    >
                        <span>معاينة الموقع</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 -mt-4">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                    {[
                        { label: "الإعلانات", count: stats.listings, color: "text-sky-600" },
                        { label: "العيادات", count: stats.doctors, color: "text-teal-600" },
                        { label: "المتاجر", count: stats.stores, color: "text-amber-600" },
                        { label: "الصنايعية", count: stats.craftsmen, color: "text-indigo-600" },
                        { label: "إجمالي الحجوزات", count: stats.appointments, color: "text-emerald-600" },
                    ].map((s, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
                            <p className="text-xs font-bold text-slate-500 mb-1">{s.label}</p>
                            <p className={`text-2xl font-extrabold ${s.color}`}>{s.count}</p>
                        </div>
                    ))}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                    <div className="flex flex-wrap gap-2">
                        {[
                            { key: "listings", label: "الإعلانات", icon: Tag },
                            { key: "doctors", label: "العيادات", icon: Stethoscope },
                            { key: "stores", label: "المتاجر", icon: Store },
                            { key: "craftsmen", label: "الصنايعية", icon: Wrench },
                        ].map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.key;
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => loadTabData(tab.key as any)}
                                    className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
                                        isActive
                                            ? "bg-slate-900 text-white shadow-sm"
                                            : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {activeTab === "doctors" && (
                        <button
                            onClick={() => setShowAddDoctor(!showAddDoctor)}
                            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm"
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span>إضافة طبيب جديد</span>
                        </button>
                    )}
                </div>

                {activeTab === "doctors" && showAddDoctor && (
                    <form onSubmit={handleAddDoctor} className="bg-white p-6 rounded-2xl border border-teal-200 shadow-sm mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <input
                            type="text"
                            required
                            placeholder="اسم الطبيب (مثال: د. محمد علي)"
                            value={docForm.doctor_name}
                            onChange={(e) => setDocForm({ ...docForm, doctor_name: e.target.value })}
                            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                        />
                        <input
                            type="text"
                            required
                            placeholder="التخصص (مثال: أطفال وحديثي الولادة)"
                            value={docForm.specialty}
                            onChange={(e) => setDocForm({ ...docForm, specialty: e.target.value })}
                            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                        />
                        <input
                            type="text"
                            required
                            placeholder="المنطقة / القرية"
                            value={docForm.area}
                            onChange={(e) => setDocForm({ ...docForm, area: e.target.value })}
                            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                        />
                        <input
                            type="text"
                            required
                            placeholder="العنوان بالتفصيل"
                            value={docForm.address}
                            onChange={(e) => setDocForm({ ...docForm, address: e.target.value })}
                            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                        />
                        <input
                            type="tel"
                            required
                            placeholder="رقم هاتف العيادة"
                            value={docForm.phone}
                            onChange={(e) => setDocForm({ ...docForm, phone: e.target.value })}
                            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                        />
                        <input
                            type="number"
                            required
                            placeholder="سعر الكشف"
                            value={docForm.fee}
                            onChange={(e) => setDocForm({ ...docForm, fee: Number(e.target.value) })}
                            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                        />
                        <input
                            type="text"
                            required
                            placeholder="مواعيد العمل"
                            value={docForm.working_hours}
                            onChange={(e) => setDocForm({ ...docForm, working_hours: e.target.value })}
                            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm sm:col-span-2"
                        />
                        <button type="submit" className="py-2.5 rounded-xl bg-teal-600 text-white font-bold text-sm hover:bg-teal-700">
                            حفظ ونشر العيادة
                        </button>
                    </form>
                )}

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                        <Search className="w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="ابحث بالاسم أو العنوان أو المنطقة..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full text-sm focus:outline-none"
                        />
                    </div>

                    {loadingData ? (
                        <div className="py-12 flex justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <p className="text-center text-sm text-slate-400 py-12">لا توجد بيانات في هذا القسم حالياً.</p>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {filteredItems.map((item) => (
                                <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50">
                                    <div>
                                        <p className="text-sm font-extrabold text-slate-900">
                                            {item.title || item.doctor_name || item.name}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {item.area || item.category || item.specialty || ""} • {item.phone || ""}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold flex items-center gap-1 transition"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>حذف</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

