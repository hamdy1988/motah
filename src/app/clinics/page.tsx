"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { SHIBIN_VILLAGES } from "@/lib/areas";
import {
    ArrowRight,
    Stethoscope,
    MapPin,
    Clock,
    PlusCircle,
    Search,
    Loader2,
    CalendarCheck,
    Users,
} from "lucide-react";

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
    "تحاليل وأشعة",
];

interface DoctorItem {
    id: string;
    doctor_name: string;
    specialty: string;
    area: string;
    address: string;
    phone: string;
    fee: number;
    working_hours: string;
    current_serving_number: number;
}

export default function ClinicsPage() {
    const [doctors, setDoctors] = useState<DoctorItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    const [selectedArea, setSelectedArea] = useState("كل شبين القناطر وقراها");
    const [selectedSpec, setSelectedSpec] = useState("كل التخصصات");
    const [showForm, setShowForm] = useState(false);

    const [doctorName, setDoctorName] = useState("");
    const [specialty, setSpecialty] = useState("باطنة وجهاز هضمي");
    const [area, setArea] = useState("مدينة شبين القناطر");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [fee, setFee] = useState("150");
    const [workingHours, setWorkingHours] = useState("يومياً من 5 مساءً إلى 10 مساءً");
    const [submitting, setSubmitting] = useState(false);

    const fetchDoctors = async () => {
        const { data } = await supabase
            .from("doctors")
            .select("*")
            .order("created_at", { ascending: false });
        if (data) setDoctors(data);
        setLoading(false);
    };

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUserId(data.user?.id || null);
        });
        fetchDoctors();
    }, []);

    const handleRegisterClinic = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;
        setSubmitting(true);

        const { error } = await supabase.from("doctors").insert({
            user_id: userId,
            doctor_name: doctorName,
            specialty,
            area,
            address,
            phone,
            fee: Number(fee),
            working_hours: workingHours,
        });

        setSubmitting(false);
        if (!error) {
            setShowForm(false);
            setDoctorName("");
            setAddress("");
            setPhone("");
            fetchDoctors();
        } else {
            alert("حدث خطأ: " + error.message);
        }
    };
    const filteredDoctors = doctors.filter((doc) => {
        const matchArea =
            selectedArea === "كل شبين القناطر وقراها" || doc.area === selectedArea;
        const matchSpec =
            selectedSpec === "كل التخصصات" || doc.specialty === selectedSpec;
        return matchArea && matchSpec;
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
                            <div className="w-11 h-11 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-sm">
                                <Stethoscope className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                                    احجز عيادتك بدون زحمة
                                </h1>
                                <p className="text-sm text-slate-500">
                                    احجز دورك أونلاين وتابع الرقم الحالي في العيادة لحظة بلحظة
                                </p>
                            </div>
                        </div>
                    </div>

                    {userId ? (
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold px-5 py-3 rounded-xl shadow-sm transition"
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span>{showForm ? "إغلاق النموذج" : "سجّل عيادتك كطبيب"}</span>
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold px-5 py-3 rounded-xl transition"
                        >
                            <span>سجّل الدخول لإضافة عيادتك</span>
                        </Link>
                    )}
                </div>

                {showForm && (
                    <form
                        onSubmit={handleRegisterClinic}
                        className="bg-white rounded-2xl border border-sky-200 p-6 mb-8 shadow-md space-y-4"
                    >
                        <h2 className="text-lg font-extrabold text-slate-900">تسجيل عيادة جديدة</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">اسم الطبيب</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="مثال: د. أحمد عبد الرحمن"
                                    value={doctorName}
                                    onChange={(e) => setDoctorName(e.target.value)}
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">التخصص الطبي</label>
                                <select
                                    value={specialty}
                                    onChange={(e) => setSpecialty(e.target.value)}
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                >
                                    {SPECIALTIES.map((s) => (
                                        <option key={s} value={s}>{s}</option>
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
                                <label className="block text-xs font-bold text-slate-700 mb-1">عنوان العيادة</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="مثال: برج الأطباء - الدور الثالث"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">سعر الكشف (ج.م)</label>
                                <input
                                    type="number"
                                    required
                                    value={fee}
                                    onChange={(e) => setFee(e.target.value)}
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">رقم موبايل العيادة</label>
                                <input
                                    type="tel"
                                    required
                                    placeholder="010xxxxxxxx"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                />
                            </div>

                            <div className="sm:col-span-2 lg:col-span-3">
                                <label className="block text-xs font-bold text-slate-700 mb-1">مواعيد العمل</label>
                                <input
                                    type="text"
                                    required
                                    value={workingHours}
                                    onChange={(e) => setWorkingHours(e.target.value)}
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-xl transition flex items-center gap-2"
                        >
                            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            <span>حفظ ونشر العيادة</span>
                        </button>
                    </form>
                )}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-8 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative flex items-center">
                        <Search className="w-4 h-4 text-slate-400 absolute right-3" />
                        <select
                            value={selectedSpec}
                            onChange={(e) => setSelectedSpec(e.target.value)}
                            className="w-full pr-9 pl-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                        >
                            <option value="كل التخصصات">كل التخصصات الطبية</option>
                            {SPECIALTIES.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    <div className="relative flex items-center">
                        <MapPin className="w-4 h-4 text-sky-600 absolute right-3" />
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
                        <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
                    </div>
                ) : filteredDoctors.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                        <p className="text-lg font-bold text-slate-800 mb-1">لا توجد عيادات مسجلة في هذا التخصص حالياً</p>
                        <p className="text-sm text-slate-500">سجّل عيادتك الآن مجاناً لتنظيم حجوزات المرضى!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDoctors.map((doc) => (
                            <div
                                key={doc.id}
                                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="px-3 py-1 rounded-lg bg-sky-50 text-sky-700 text-xs font-extrabold">
                                            {doc.specialty}
                                        </span>
                                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600">
                                            <MapPin className="w-3.5 h-3.5 text-sky-600" />
                                            {doc.area}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-extrabold text-slate-900 mb-1">{doc.doctor_name}</h3>
                                    <p className="text-xs text-slate-500 mb-3">{doc.address}</p>

                                    <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl">
                                        <p className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5 text-sky-600" />
                                            <span>{doc.working_hours}</span>
                                        </p>
                                        <p className="flex items-center gap-1.5 font-bold text-slate-800">
                                            <Users className="w-3.5 h-3.5 text-emerald-600" />
                                            <span>الكشف الحالي وصل لرقم: {doc.current_serving_number}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                                    <div>
                                        <span className="text-xs text-slate-400 block">سعر الكشف</span>
                                        <span className="text-base font-extrabold text-slate-900">{doc.fee} ج.م</span>
                                    </div>

                                    <Link
                                        href={`/clinics/${doc.id}`}
                                        className="flex-1 py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
                                    >
                                        <CalendarCheck className="w-4 h-4" />
                                        <span>احجز دورك الآن</span>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
