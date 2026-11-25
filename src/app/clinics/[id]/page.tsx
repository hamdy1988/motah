"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
    ArrowRight,
    MapPin,
    Clock,
    Phone,
    Users,
    CalendarCheck,
    CheckCircle2,
    Loader2,
    ChevronLeft,
    RotateCcw,
} from "lucide-react";

interface DoctorDetail {
    id: string;
    user_id: string;
    doctor_name: string;
    specialty: string;
    area: string;
    address: string;
    phone: string;
    fee: number;
    working_hours: string;
    current_serving_number: number;
}

interface AppointmentItem {
    id: string;
    patient_name: string;
    patient_phone: string;
    queue_number: number;
    status: string;
}

export default function SingleClinicPage() {
    const params = useParams();
    const id = params?.id as string;

    const [doctor, setDoctor] = useState<DoctorDetail | null>(null);
    const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const [patientName, setPatientName] = useState("");
    const [patientPhone, setPatientPhone] = useState("");
    const [booking, setBooking] = useState(false);
    const [bookedNumber, setBookedNumber] = useState<number | null>(null);

    const fetchClinicData = async () => {
        if (!id) return;
        const { data: docData } = await supabase
            .from("doctors")
            .select("*")
            .eq("id", id)
            .single();

        if (docData) {
            setDoctor(docData);
            const today = new Date().toISOString().split("T")[0];
            const { data: appData } = await supabase
                .from("appointments")
                .select("*")
                .eq("doctor_id", id)
                .eq("booking_date", today)
                .order("queue_number", { ascending: true });

            if (appData) setAppointments(appData);
        }
        setLoading(false);
    };

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setCurrentUserId(data.user?.id || null);
        });
        fetchClinicData();
    }, [id]);

    const handleBook = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!doctor) return;
        setBooking(true);

        const nextNumber = appointments.length + 1;
        const { error } = await supabase.from("appointments").insert({
            doctor_id: doctor.id,
            patient_name: patientName,
            patient_phone: patientPhone,
            queue_number: nextNumber,
        });

        setBooking(false);
        if (!error) {
            setBookedNumber(nextNumber);
            setPatientName("");
            setPatientPhone("");
            fetchClinicData();
        } else {
            alert("حدث خطأ أثناء الحجز: " + error.message);
        }
    };

    const handleNextPatient = async () => {
        if (!doctor) return;
        const nextServing = doctor.current_serving_number + 1;
        await supabase
            .from("doctors")
            .update({ current_serving_number: nextServing })
            .eq("id", doctor.id);
        fetchClinicData();
    };

    const handleResetQueue = async () => {
        if (!doctor) return;
        const ok = window.confirm("هل تريد تصفير رقم الدور لبداية يوم عمل جديد؟");
        if (!ok) return;
        await supabase
            .from("doctors")
            .update({ current_serving_number: 0 })
            .eq("id", doctor.id);
        fetchClinicData();
    };
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">عذراً، هذه العيادة غير موجودة</h1>
                <Link href="/clinics" className="px-5 py-2.5 bg-sky-600 text-white font-bold rounded-xl">
                    العودة لجميع العيادات
                </Link>
            </div>
        );
    }

    const isDoctorOwner = currentUserId === doctor.user_id;

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <Link
                    href="/clinics"
                    className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 mb-4"
                >
                    <ArrowRight className="w-4 h-4" />
                    <span>العودة لدليل العيادات</span>
                </Link>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <span className="px-3 py-1 rounded-lg bg-sky-50 text-sky-700 text-xs font-extrabold">
                                {doctor.specialty}
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 mb-1">
                                {doctor.doctor_name}
                            </h1>
                            <p className="text-sm text-slate-600 flex items-center gap-1.5 mb-2">
                                <MapPin className="w-4 h-4 text-sky-600" />
                                <span>
                                    {doctor.area} • {doctor.address}
                                </span>
                            </p>
                            <p className="text-xs text-slate-500 flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-sky-600" />
                                <span>{doctor.working_hours}</span>
                            </p>
                        </div>

                        <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl text-center">
                            <p className="text-xs text-slate-300 mb-1">الكشف الحالي وصل لرقم</p>
                            <p className="text-4xl font-extrabold text-emerald-400">
                                {doctor.current_serving_number}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                                إجمالي حجوزات اليوم: {appointments.length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h2 className="text-lg font-extrabold text-slate-900 mb-1 flex items-center gap-2">
                            <CalendarCheck className="w-5 h-5 text-sky-600" />
                            <span>احجز دورك في العيادة</span>
                        </h2>
                        <p className="text-xs text-slate-500 mb-5">
                            سجل اسمك ورقمك واحصل على رقم دورك فوراً بدون انتظار
                        </p>

                        {bookedNumber && (
                            <div className="mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                                <CheckCircle2 className="w-7 h-7 text-emerald-600 mx-auto mb-1" />
                                <p className="text-sm font-bold text-emerald-900">تم تأكيد حجزك بنجاح!</p>
                                <p className="text-xs text-emerald-700 mt-1">رقم دورك في الكشف هو:</p>
                                <p className="text-3xl font-extrabold text-emerald-600 mt-1">#{bookedNumber}</p>
                            </div>
                        )}

                        <form onSubmit={handleBook} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">اسم المريض</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="الاسم ثلاثي"
                                    value={patientName}
                                    onChange={(e) => setPatientName(e.target.value)}
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">رقم الموبايل</label>
                                <input
                                    type="tel"
                                    required
                                    placeholder="010xxxxxxxx"
                                    value={patientPhone}
                                    onChange={(e) => setPatientPhone(e.target.value)}
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={booking}
                                className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2"
                            >
                                {booking && <Loader2 className="w-4 h-4 animate-spin" />}
                                <span>تأكيد الحجز والحصول على رقم</span>
                            </button>
                        </form>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                                <Users className="w-5 h-5 text-emerald-600" />
                                <span>قائمة أدوار اليوم ({appointments.length})</span>
                            </h2>
                        </div>

                        {isDoctorOwner && (
                            <div className="flex gap-2 mb-4 p-3 rounded-xl bg-sky-50 border border-sky-200">
                                <button
                                    onClick={handleNextPatient}
                                    className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition"
                                >
                                    <span>الرقم التالي ({doctor.current_serving_number + 1})</span>
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={handleResetQueue}
                                    title="تصفير العداد ليوم جديد"
                                    className="px-3 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold flex items-center gap-1"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    <span>تصفير</span>
                                </button>
                            </div>
                        )}

                        {appointments.length === 0 ? (
                            <p className="text-sm text-slate-500 text-center py-8">
                                لا توجد حجوزات مسجلة اليوم حتى الآن.
                            </p>
                        ) : (
                            <div className="space-y-2 max-h-72 overflow-y-auto">
                                {appointments.map((app) => {
                                    const isCurrent = app.queue_number === doctor.current_serving_number;
                                    return (
                                        <div
                                            key={app.id}
                                            className={`p-3 rounded-xl border flex items-center justify-between text-xs ${isCurrent
                                                    ? "bg-emerald-50 border-emerald-300 font-bold"
                                                    : "bg-slate-50 border-slate-100"
                                                }`}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-extrabold flex items-center justify-center">
                                                    {app.queue_number}
                                                </span>
                                                <div>
                                                    <p className="font-bold text-slate-900">{app.patient_name}</p>
                                                    {isDoctorOwner && (
                                                        <a href={`tel:${app.patient_phone}`} className="text-sky-600">
                                                            {app.patient_phone}
                                                        </a>
                                                    )}
                                                </div>
                                            </div>

                                            <span
                                                className={`px-2 py-1 rounded-md font-bold ${isCurrent
                                                        ? "bg-emerald-600 text-white"
                                                        : app.queue_number < doctor.current_serving_number
                                                            ? "bg-slate-200 text-slate-500"
                                                            : "bg-amber-100 text-amber-800"
                                                    }`}
                                            >
                                                {isCurrent
                                                    ? "بالداخل الآن"
                                                    : app.queue_number < doctor.current_serving_number
                                                        ? "تم الكشف"
                                                        : "في الانتظار"}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
