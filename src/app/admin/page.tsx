"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { supabase } from "@/lib/supabase";
import { SHIBIN_VILLAGES } from "@/lib/areas";
import {
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

const ADMIN_PHONE = "01063686679";

const SPECIALTIES = [
    "باطنة وجهاز هضمي",
    "أطفال وحديثي الولادة",
    "نساء وتوليد",
    "عظام ومفاصل",
    "أسنان",
    "أنف وأذن وحنجرة",
    "عيون ورمد",
    "جلدية وتجميل",
    "قلب وأوعية دموية",
    "مخ وأعصاب",
    "مسالك بولية",
    "جراحة عامة ومناظير",
    "صدر وجهاز تنفسي",
    "علاج طبيعي وتأهيل",
    "نفسية وعصبية",
    "تغذية علاجية وسمنة",
    "تحاليل وأشعة",
    "صيدليات",
    "تخصص آخر",
];

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
export default function AdminDashboardPage() {
    const [authorized, setAuthorized] = useState<boolean | null>(null);
    const [activeTab, setActiveTab] = useState<"listings" | "doctors" | "stores" | "craftsmen">("listings");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterArea, setFilterArea] = useState("كل شبين القناطر وقراها");
    const [filterSpecialty, setFilterSpecialty] = useState("كل التخصصات");
    const [filterProfession, setFilterProfession] = useState("كل المهن");

    const [stats, setStats] = useState({ listings: 0, doctors: 0, stores: 0, craftsmen: 0, appointments: 0 });
    const [items, setItems] = useState<any[]>([]);
    const [loadingData, setLoadingData] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);

    const [docForm, setDocForm] = useState({
        doctor_name: "",
        specialty: "باطنة وجهاز هضمي",
        area: "مدينة شبين القناطر",
        address: "",
        phone: "",
        fee: 150,
        working_hours: "يومياً من 5 مساءً إلى 10 مساءً",
    });

    const [storeForm, setStoreForm] = useState({
        name: "",
        category: "ملابس وأحذية",
        area: "مدينة شبين القناطر",
        address: "",
        phone: "",
    });

    const [craftForm, setCraftForm] = useState({
        name: "",
        profession: "سباك",
        area: "مدينة شبين القناطر",
        phone: "",
    });
    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            const email = data.user?.email || "";
            const phone = data.user?.phone || "";
            if (email.startsWith(ADMIN_PHONE) || phone.includes(ADMIN_PHONE)) {
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
        setShowAddForm(false);
        setFilterArea("كل شبين القناطر وقراها");
        setFilterSpecialty("كل التخصصات");
        setFilterProfession("كل المهن");
        setLoadingData(true);
        const { data } = await supabase
            .from(tab)
            .select("*")
            .order("created_at", { ascending: false })
            .limit(100);
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
            setShowAddForm(false);
            setDocForm({ ...docForm, doctor_name: "", address: "", phone: "" });
            loadAllStats();
            loadTabData("doctors");
        } else {
            alert("خطأ في الإضافة: " + error.message);
        }
    };

    const handleAddStore = async (e: React.FormEvent) => {
        e.preventDefault();
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return;

        const { error } = await supabase.from("stores").insert({
            ...storeForm,
            user_id: userData.user.id,
        });

        if (!error) {
            alert("تمت إضافة المتجر بنجاح!");
            setShowAddForm(false);
            setStoreForm({ ...storeForm, name: "", address: "", phone: "" });
            loadAllStats();
            loadTabData("stores");
        } else {
            alert("خطأ في الإضافة: " + error.message);
        }
    };

    const handleAddCraftsman = async (e: React.FormEvent) => {
        e.preventDefault();
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return;

        const { error } = await supabase.from("craftsmen").insert({
            ...craftForm,
            user_id: userData.user.id,
        });

        if (!error) {
            alert("تمت إضافة الصنايعي بنجاح!");
            setShowAddForm(false);
            setCraftForm({ ...craftForm, name: "", phone: "" });
            loadAllStats();
            loadTabData("craftsmen");
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
        const text = `${item.title || ""} ${item.doctor_name || ""} ${item.name || ""} ${item.area || ""} ${item.specialty || ""} ${item.profession || ""}`.toLowerCase();
        const matchSearch = text.includes(searchQuery.toLowerCase());
        const matchArea = filterArea === "كل شبين القناطر وقراها" || item.area === filterArea;
        const matchSpec =
            activeTab !== "doctors" ||
            filterSpecialty === "كل التخصصات" ||
            item.specialty === filterSpecialty;
        const matchProf =
            activeTab !== "craftsmen" ||
            filterProfession === "كل المهن" ||
            item.profession === filterProfession;
        return matchSearch && matchArea && matchSpec && matchProf;
    });

    const addButtonLabel =
        activeTab === "doctors"
            ? "إضافة طبيب جديد"
            : activeTab === "stores"
                ? "إضافة متجر جديد"
                : activeTab === "craftsmen"
                    ? "إضافة صنايعي جديد"
                    : "";

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            <div className="bg-slate-900 text-white py-6 px-4 shadow-md">
                <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Logo lightText />
                        <div className="hidden sm:block border-r border-slate-700 pr-4">
                            <h1 className="text-base font-extrabold flex items-center gap-2 text-white">
                                <span>غرفة تحكم منصة مُتاح</span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30">
                                    Admin
                                </span>
                            </h1>
                            <p className="text-xs text-slate-400 mt-0.5">
                                إدارة المحتوى، العيادات، والمتاجر في شبين القناطر
                            </p>
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
                                    className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${isActive
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

                    {addButtonLabel && (
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm"
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span>{addButtonLabel}</span>
                        </button>
                    )}
                </div>

                {activeTab === "doctors" && showAddForm && (
                    <form onSubmit={handleAddDoctor} className="bg-white p-6 rounded-2xl border border-teal-200 shadow-sm mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <input
                            type="text"
                            required
                            placeholder="اسم الطبيب (مثال: د. محمد علي)"
                            value={docForm.doctor_name}
                            onChange={(e) => setDocForm({ ...docForm, doctor_name: e.target.value })}
                            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                        />
                        <select
                            value={docForm.specialty}
                            onChange={(e) => setDocForm({ ...docForm, specialty: e.target.value })}
                            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                        >
                            {SPECIALTIES.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        <select
                            value={docForm.area}
                            onChange={(e) => setDocForm({ ...docForm, area: e.target.value })}
                            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                        >
                            {SHIBIN_VILLAGES.filter((v) => v !== "كل شبين القناطر وقراها").map((v) => (
                                <option key={v} value={v}>{v}</option>
                            ))}
                        </select>
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
                            placeholder="سعر الكشف بالجنيه"
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
                        <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl py-2.5 text-sm">
                            حفظ العيادة
                        </button>
                    </form>
                )}
                {activeTab === "stores" && showAddForm && (
                    <form onSubmit={handleAddStore} className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <input
                            type="text"
                            required
                            placeholder="اسم المتجر أو المحل"
                            value={storeForm.name}
                            onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                        />
                        <input
                            type="text"
                            required
                            placeholder="التصنيف (ملابس، سوبر ماركت، صيدلية...)"
                            value={storeForm.category}
                            onChange={(e) => setStoreForm({ ...storeForm, category: e.target.value })}
                            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                        />
                        <select
                            value={storeForm.area}
                            onChange={(e) => setStoreForm({ ...storeForm, area: e.target.value })}
                            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                        >
                            {SHIBIN_VILLAGES.filter((v) => v !== "كل شبين القناطر وقراها").map((v) => (
                                <option key={v} value={v}>{v}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            required
                            placeholder="العنوان بالتفصيل"
                            value={storeForm.address}
                            onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
                            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                        />
                        <input
                            type="tel"
                            required
                            placeholder="رقم هاتف المتجر"
                            value={storeForm.phone}
                            onChange={(e) => setStoreForm({ ...storeForm, phone: e.target.value })}
                            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                        />
                        <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl py-2.5 text-sm">
                            حفظ المتجر
                        </button>
                    </form>
                )}

                {activeTab === "craftsmen" && showAddForm && (
                    <form onSubmit={handleAddCraftsman} className="bg-white p-6 rounded-2xl border border-indigo-200 shadow-sm mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                            type="text"
                            required
                            placeholder="اسم الصنايعي"
                            value={craftForm.name}
                            onChange={(e) => setCraftForm({ ...craftForm, name: e.target.value })}
                            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                        />
                        <select
                            value={craftForm.profession}
                            onChange={(e) => setCraftForm({ ...craftForm, profession: e.target.value })}
                            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                        >
                            {PROFESSIONS.map((p) => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                        <select
                            value={craftForm.area}
                            onChange={(e) => setCraftForm({ ...craftForm, area: e.target.value })}
                            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                        >
                            {SHIBIN_VILLAGES.filter((v) => v !== "كل شبين القناطر وقراها").map((v) => (
                                <option key={v} value={v}>{v}</option>
                            ))}
                        </select>
                        <input
                            type="tel"
                            required
                            placeholder="رقم الهاتف"
                            value={craftForm.phone}
                            onChange={(e) => setCraftForm({ ...craftForm, phone: e.target.value })}
                            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                        />
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl py-2.5 text-sm sm:col-span-2">
                            حفظ الصنايعي
                        </button>
                    </form>
                )}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                            <Search className="w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="ابحث بالاسم أو العنوان أو المنطقة..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full text-sm focus:outline-none"
                            />
                        </div>

                        <select
                            value={filterArea}
                            onChange={(e) => setFilterArea(e.target.value)}
                            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50"
                        >
                            <option value="كل شبين القناطر وقراها">كل شبين القناطر وقراها</option>
                            {SHIBIN_VILLAGES.filter((v) => v !== "كل شبين القناطر وقراها").map((v) => (
                                <option key={v} value={v}>{v}</option>
                            ))}
                        </select>

                        {activeTab === "doctors" && (
                            <select
                                value={filterSpecialty}
                                onChange={(e) => setFilterSpecialty(e.target.value)}
                                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50"
                            >
                                <option value="كل التخصصات">كل التخصصات</option>
                                {SPECIALTIES.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        )}

                        {activeTab === "craftsmen" && (
                            <select
                                value={filterProfession}
                                onChange={(e) => setFilterProfession(e.target.value)}
                                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50"
                            >
                                <option value="كل المهن">كل المهن</option>
                                {PROFESSIONS.map((p) => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        )}
                    </div>

                    {loadingData ? (
                        <div className="p-12 text-center text-slate-400">
                            <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="p-12 text-center text-sm text-slate-400">
                            لا توجد بيانات في هذا القسم حالياً.
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {filteredItems.map((item) => (
                                <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50">
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">
                                            {item.title || item.doctor_name || item.name}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {item.specialty || item.category || item.profession || ""}
                                            {item.area ? ` • ${item.area}` : ""}
                                            {item.phone ? ` • ${item.phone}` : ""}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition"
                                        title="حذف"
                                    >
                                        <Trash2 className="w-4 h-4" />
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
