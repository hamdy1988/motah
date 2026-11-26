import React from "react";
import Link from "next/link";
import { ShieldCheck, MapPin, HeartHandshake, ArrowRight } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm">
                <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 mb-6">
                    <ArrowRight className="w-4 h-4" />
                    <span>العودة للرئيسية</span>
                </Link>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">
                    من نحن — منصة مُتاح (Motah)
                </h1>
                <p className="text-slate-600 leading-relaxed mb-6">
                    <strong>مُتاح</strong> هي أول منصة رقمية محلية متكاملة تخدم أهالي <strong>مدينة شبين القناطر وجميع القرى التابعة لها</strong>. تهدف المنصة إلى تسهيل الوصول إلى الخدمات اليومية، وتقليل الزحام في العيادات الطبية، وربط أصحاب المتاجر والصنايعية بالعملاء في منطقتهم بسهولة وأمان.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <MapPin className="w-6 h-6 text-teal-600 mb-2" />
                        <h3 className="font-bold text-slate-900 text-sm mb-1">خدمة محلية 100%</h3>
                        <p className="text-xs text-slate-500">مصمم خصيصاً لمدينة شبين القناطر وقراها لتصل لأقرب خدمة إليك.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <ShieldCheck className="w-6 h-6 text-teal-600 mb-2" />
                        <h3 className="font-bold text-slate-900 text-sm mb-1">خصوصية وأمان</h3>
                        <p className="text-xs text-slate-500">نحمي بيانات المستخدمين والمرضى بأحدث معايير الأمان الرقمي.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <HeartHandshake className="w-6 h-6 text-teal-600 mb-2" />
                        <h3 className="font-bold text-slate-900 text-sm mb-1">دعم التجارة المحلية</h3>
                        <p className="text-xs text-slate-500">نساعد المحلات والحرفيين على عرض خدماتهم والوصول لعملاء جدد.</p>
                    </div>
                </div>

                <div className="p-5 rounded-xl bg-teal-50 border border-teal-100 text-sm text-teal-900">
                    <p className="font-bold mb-1">للتواصل مع إدارة المنصة أو إضافة عيادتك / متجرك:</p>
                    <p>واتساب وهاتف الإدارة: <strong dir="ltr">01063686679</strong></p>
                </div>
            </div>
        </div>
    );
}
