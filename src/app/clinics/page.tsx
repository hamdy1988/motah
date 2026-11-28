"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { SHIBIN_VILLAGES } from "@/lib/areas";
import { getWhatsAppUrl } from "@/lib/whatsapp";

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
    Phone,
    MessageCircle,
    Image as ImageIcon,
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
    "جراحة عامة ومناظير",
    "صدر وجهاز تنفسي",
    "علاج طبيعي وتأهيل",
    "نفسية وعصبية",
    "تغذية علاجية وسمنة",
    "تحاليل وأشعة",
    "صيدليات",
    "تخصص آخر",
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
    image_url?: string | null;
}
export default function ClinicsPage() {
    const [doctors, setDoctors] = useState<DoctorItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    const [selectedArea, setSelectedArea] = useState("كل شبين القناطر وقراها");
    const [selectedSpec, setSelectedSpec] = useState("كل التخصصات");
    const [searchQuery, setSearchQuery] = useState("");
    const [showForm, setShowForm] = useState(false);

    const [doctorName, setDoctorName] = useState("");
    const [specialty, setSpecialty] = useState("باطنة وجهاز هضمي");
    const [area, setArea] = useState("مدينة شبين القناطر");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [fee, setFee] = useState("150");
    const [workingHours, setWorkingHours] = useState("يومياً من 5 مساءً إلى 10 مساءً");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
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

        let uploadedImageUrl: string | null = null;

        if (imageFile) {
            const fileExt = imageFile.name.split(".").pop();
            const fileName = `doctor-${userId}-${Date.now()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from("listings")
                .upload(fileName, imageFile);

            if (!uploadError) {
                const { data: publicUrlData } = supabase.storage
                    .from("listings")
                    .getPublicUrl(fileName);
                uploadedImageUrl = publicUrlData.publicUrl;
            }
        }

        const { error } = await supabase.from("doctors").insert({
            user_id: userId,
            doctor_name: doctorName.trim(),
            specialty,
            area,
            address: address.trim(),
            phone: phone.trim(),
            fee: Number(fee),
            working_hours: workingHours.trim(),
            image_url: uploadedImageUrl,
        });

        setSubmitting(false);
        if (!error) {
            alert("تم تسجيل العيادة ونشرها بنجاح!");
            setShowForm(false);
            setDoctorName("");
            setAddress("");
            setPhone("");
            setImageFile(null);
            setImagePreview("");
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
        const matchSearch =
            doc.doctor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.address.toLowerCase().includes(searchQuery.toLowerCase());
        return matchArea && matchSpec && matchSearch;
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
                                    {SHIBIN_VILLAGES.filter((v) => v !== "كل شبين القناطر وقراها").map((v) => (
                                        <option key={v} value={v}>{v}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">عنوان العيادة بالتفصيل</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="مثال: شارع بورسعيد - برج الأطباء - الدور الثاني"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">رقم هاتف / واتساب العيادة</label>
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
                                <label className="block text-xs font-bold text-slate-700 mb-1">سعر الكشف (بالجنيه)</label>
                                <input
                                    type="number"
                                    required
                                    value={fee}
                                    onChange={(e) => setFee(e.target.value)}
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

                            <div className="sm:col-span-2 lg:col-span-3">
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    صورة الطبيب أو لوجو العيادة (اختياري)
                                </label>
                                <div className="flex items-center gap-4 p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="معاينة"
                                            className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                                            <ImageIcon className="w-6 h-6" />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setImageFile(file);
                                                setImagePreview(URL.createObjectURL(file));
                                            }
                                        }}
                                        className="text-xs text-slate-600 file:ml-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-sky-600 file:text-white hover:file:bg-sky-700 cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-sm transition"
                        >
                            {submitting ? "جاري الحفظ..." : "حفظ ونشر العيادة"}
                        </button>
                    </form>
                )}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="relative flex items-center">
                        <Search className="w-4 h-4 text-slate-400 absolute right-3" />
                        <input
                            type="text"
                            placeholder="ابحث باسم الطبيب أو العنوان..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pr-9 pl-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                        />
                    </div>

                    <select
                        value={selectedSpec}
                        onChange={(e) => setSelectedSpec(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700"
                    >
                        <option value="كل التخصصات">كل التخصصات</option>
                        {SPECIALTIES.map((s) => (
                            <option key={s} value={s}>{s}</option>
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
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-sky-600" />
                    </div>
                ) : filteredDoctors.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                        <p className="text-lg font-bold text-slate-800 mb-1">لا توجد عيادات مطابقة لبحثك حالياً</p>
                        <p className="text-sm text-slate-500">جرّب تغيير التخصص أو المنطقة، أو سجّل عيادتك الآن.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDoctors.map((doc) => (
                            <div
                                key={doc.id}
                                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center gap-3.5 mb-4">
                                        {doc.image_url ? (
                                            <img
                                                src={doc.image_url}
                                                alt={doc.doctor_name}
                                                className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                                                <Stethoscope className="w-8 h-8" />
                                            </div>
                                        )}
                                        <div>
                                            <span className="inline-block px-2.5 py-0.5 rounded-lg bg-sky-50 text-sky-700 text-xs font-bold mb-1">
                                                {doc.specialty}
                                            </span>
                                            <h3 className="font-extrabold text-slate-900 text-lg leading-snug">
                                                {doc.doctor_name}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-xs text-slate-600 mb-4">
                                        <p className="flex items-center gap-1.5">
                                            <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
                                            <span>{doc.area} - {doc.address}</span>
                                        </p>
                                        <p className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4 text-sky-600 shrink-0" />
                                            <span>{doc.working_hours}</span>
                                        </p>
                                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                            <span className="font-bold text-slate-800">
                                                الكشف: <span className="text-sky-700">{doc.fee} ج.م</span>
                                            </span>
                                            <span className="inline-flex items-center gap-1 font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                                                <Users className="w-3.5 h-3.5" />
                                                الدور الحالي: {doc.current_serving_number || 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 pt-3 border-t border-slate-100">
                                    <Link
                                        href={`/clinics/${doc.id}`}
                                        className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
                                    >
                                        <CalendarCheck className="w-4 h-4" />
                                        <span>احجز دورك أونلاين</span>
                                    </Link>

                                    <div className="grid grid-cols-2 gap-2">
                                        <a
                                            href={`tel:${doc.phone}`}
                                            className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1 transition"
                                        >
                                            <Phone className="w-3.5 h-3.5" />
                                            <span>اتصال</span>
                                        </a>
                                        <a
                                            href={getWhatsAppUrl(doc.phone, `مرحباً عيادة ${doc.doctor_name}`)}
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
