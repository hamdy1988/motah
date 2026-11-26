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
    const todayStr = new Date().toISOString().slice(0, 10);

    const [doctor, setDoctor] = useState<DoctorDetail | null>(null);
    const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const [selectedDate, setSelectedDate] = useState(todayStr);
    const [patientName, setPatientName] = useState("");
    const [patientPhone, setPatientPhone] = useState("");
    const [booking, setBooking] = useState(false);
    const [bookedNumber, setBookedNumber] = useState<number | null>(null);

    const fetchClinicData = async (dateValue = selectedDate) => {
        if (!id) return;
        const { data: docData } = await supabase
            .from("doctors")
            .select("*")
            .eq("id", id)
            .single();

        if (docData) {
            setDoctor(docData);
            const { data: appData } = await supabase
                .from("appointments")
                .select("*")
                .eq("doctor_id", id)
                .eq("booking_date", dateValue)
                .order("queue_number", { ascending: true });

            if (appData) setAppointments(appData);
        }
        setLoading(false);
    };

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setCurrentUserId(data.user?.id || null);
        });
        fetchClinicData(selectedDate);
    }, [id, selectedDate]);

    const handleBook = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!doctor) return;
        setBooking(true);

        const nextNumber = appointments.length + 1;
        const { error } = await supabase.from("appointments").insert({
            doctor_id: doctor.id,
            patient_name: patientName,
            patient_phone: patientPhone,
            booking_date: selectedDate,
            queue_number: nextNumber,
        });

        setBooking(false);
        if (!error) {
            setBookedNumber(nextNumber);
            setPatientName("");
            setPatientPhone("");
            fetchClinicData(selectedDate);
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
        fetchClinicData(selectedDate);
    };

    const handleResetQueue = async () => {
        if (!doctor) return;
        const ok = window.confirm("هل تريد تصفير رقم الدور لبداية يوم عمل جديد؟");
        if (!ok) return;
        await supabase
            .from("doctors")
            .update({ current_serving_number: 0 })
            .eq("id", doctor.id);
        fetchClinicData(selectedDate);
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
                                حجوزات يوم {selectedDate}: {appointments.length}
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
                            اختر يوم الكشف وسجل اسمك ورقمك للحصول على دورك فوراً
                        </p>

                        {bookedNumber && (
                            <div className="mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                                <CheckCircle2 className="w-7 h-7 text-emerald-600 mx-auto mb-1" />
                                <p className="text-sm font-bold text-emerald-900">
                                    تم تأكيد حجزك ليوم {selectedDate} بنجاح!
                                </p>
                                <p className="text-xs text-emerald-700 mt-1">رقم دورك في الكشف هو:</p>
                                <p className="text-3xl font-extrabold text-emerald-600 mt-1">#{bookedNumber}</p>
                            </div>
                        )}

                        <form onSubmit={handleBook} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    اختر يوم الكشف
                                </label>
                                <input
                                    type="date"
                                    required
                                    min={todayStr}
                                    value={selectedDate}
                                    onChange={(e) => {
                                        setSelectedDate(e.target.value);
                                        setBookedNumber(null);
                                    }}
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    اسم المريض بالكامل
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="اكتب اسم المريض"
                                    value={patientName}
                                    onChange={(e) => setPatientName(e.target.value)}
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    رقم الهاتف / واتساب
                                </label>
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
                                className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm transition disabled:opacity-50"
                            >
                                {booking ? "جاري تأكيد الحجز..." : "تأكيد الحجز والحصول على رقم"}
                            </button>
                        </form>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                                <Users className="w-5 h-5 text-sky-600" />
                                <span>قائمة دور يوم {selectedDate}</span>
                            </h2>
                            <span className="text-xs font-bold text-slate-500">
                                الكشف: {doctor.fee} ج.م
                            </span>
                        </div>

                        {isDoctorOwner && (
                            <div className="mb-4 p-3 rounded-xl bg-sky-50 border border-sky-200 flex flex-wrap items-center justify-between gap-2">
                                <span className="text-xs font-bold text-sky-900">تحكم الطبيب في الدور:</span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleNextPatient}
                                        className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold"
                                    >
                                        المريض التالي (+1)
                                    </button>
                                    <button
                                        onClick={handleResetQueue}
                                        className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold inline-flex items-center gap-1"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                        <span>تصفير</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {appointments.length === 0 ? (
                            <p className="text-sm text-slate-400 text-center py-10">
                                لا توجد حجوزات مسجلة لهذا اليوم بعد. كن أول من يحجز!
                            </p>
                        ) : (
                            <div className="space-y-2.5 max-h-80 overflow-y-auto">
                                {appointments.map((app) => {
                                    const isCurrent = app.queue_number === doctor.current_serving_number;
                                    const isDone = app.queue_number < doctor.current_serving_number;
                                    return (
                                        <div
                                            key={app.id}
                                            className={`p-3 rounded-xl border flex items-center justify-between ${isCurrent
                                                    ? "bg-emerald-50 border-emerald-300"
                                                    : isDone
                                                        ? "bg-slate-50 border-slate-200 opacity-60"
                                                        : "bg-white border-slate-200"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-extrabold ${isCurrent
                                                            ? "bg-emerald-600 text-white"
                                                            : "bg-slate-100 text-slate-700"
                                                        }`}
                                                >
                                                    #{app.queue_number}
                                                </span>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">
                                                        {app.patient_name}
                                                    </p>
                                                    {isDoctorOwner && (
                                                        <p className="text-xs text-slate-500 flex items-center gap-1">
                                                            <Phone className="w-3 h-3" />
                                                            <span>{app.patient_phone}</span>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="text-xs font-bold">
                                                {isCurrent ? (
                                                    <span className="text-emerald-700">بالداخل الآن</span>
                                                ) : isDone ? (
                                                    <span className="text-slate-400">تم الكشف</span>
                                                ) : (
                                                    <span className="text-sky-600">في الانتظار</span>
                                                )}
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
