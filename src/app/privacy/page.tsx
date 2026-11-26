import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
                <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900">
                    <ArrowRight className="w-4 h-4" />
                    <span>العودة للرئيسية</span>
                </Link>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    سياسة الخصوصية وشروط الاستخدام
                </h1>

                <section className="space-y-2 text-sm text-slate-600 leading-relaxed">
                    <h2 className="text-base font-extrabold text-slate-900">1. حماية البيانات والخصوصية</h2>
                    <p>
                        تلتزم منصة <strong>مُتاح</strong> بالحفاظ على سرية بيانات المستخدمين. لا يتم مشاركة أرقام هواتف المرضى عند حجز العيادات مع أي طرف خارجي أو زوار الموقع، وتقتصر رؤيتها على الطبيب صاحب العيادة فقط لتنظيم الكشف.
                    </p>
                </section>

                <section className="space-y-2 text-sm text-slate-600 leading-relaxed">
                    <h2 className="text-base font-extrabold text-slate-900">2. شروط نشر الإعلانات والمتاجر</h2>
                    <p>
                        يتحمل المعلن المسؤولية الكاملة عن صحة البيانات والصور المنشورة. يُحظر تماماً نشر أي إعلانات وهمية، أو محتوى مخالف للقانون أو الآداب العامة، وتحتفظ إدارة المنصة بحق حذف أي إعلان أو إيقاف أي حساب مخالف فوراً دون إشعار مسبق.
                    </p>
                </section>

                <section className="space-y-2 text-sm text-slate-600 leading-relaxed">
                    <h2 className="text-base font-extrabold text-slate-900">3. إخلاء المسؤولية</h2>
                    <p>
                        تعمل منصة مُتاح كوسيط تقني لتسهيل التواصل وحجز المواعيد في شبين القناطر وقراها، ولا تتحمل مسؤولية التعاملات المالية المباشرة التي تتم خارج المنصة بين البائع والمشتري. يُنصح دائماً بمعاينة السلع والتأكد من هوية الطرف الآخر قبل الدفع.
                    </p>
                </section>
            </div>
        </div>
    );
}
