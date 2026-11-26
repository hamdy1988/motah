import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "مُتاح | Motah - للبيع والإيجار والخدمات في شبين القناطر وقراها",
    template: "%s | منصة مُتاح - شبين القناطر",
  },
  description:
    "منصة أهالي شبين القناطر وقراها للخدمات والإعلانات: عيادات، متاجر، صنايعية، عقارات، وسيارات في مكان واحد.",
  keywords: [
    "شبين القناطر",
    "دليل شبين القناطر",
    "عيادات شبين القناطر",
    "حجز دكتور شبين القناطر",
    "متاجر شبين القناطر",
    "صنايعية شبين القناطر",
    "عقارات شبين القناطر",
    "منصة متاح",
    "كفر الدير",
    "طحانوب",
    "نوى",
    "القشيش",
    "منية شبين",
  ],
  openGraph: {
    title: "مُتاح | Motah - للبيع والإيجار والخدمات في شبين القناطر وقراها",
    description:
      "منصة أهالي شبين القناطر وقراها للخدمات والإعلانات: عيادات، متاجر، صنايعية، عقارات، وسيارات في مكان واحد.",
    url: "https://" + "motah-mrr2.vercel.app",
    siteName: "منصة مُتاح",
    locale: "ar_EG",
    type: "website",
  },
  verification: {
    google: "XOtd2kqjQhfyEmfzg7qKYtKbIW679zMnFLxHwJl2hs4",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.className} bg-slate-50 text-slate-900 antialiased flex flex-col min-h-screen`}>
        <main className="flex-1">{children}</main>

        {/* شريط التذييل السفلي (Footer) */}
        <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-12">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="text-center sm:text-right">
                <p className="text-lg font-extrabold text-white">مُتاح | Motah</p>
                <p className="text-xs text-slate-400 mt-1">
                  دليل وخدمات أهالي شبين القناطر وجميع القرى التابعة لها
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold">
                <Link href="/about" className="hover:text-white transition">
                  من نحن
                </Link>
                <Link href="/privacy" className="hover:text-white transition">
                  سياسة الخصوصية والشروط
                </Link>
                <a
                  href={"https://wa.me" + "201063686679"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 transition"
                >
                  تواصل مع الإدارة (واتساب)
                </a>
              </div>
            </div>

            <p className="text-center text-xs text-slate-500 mt-6">
              © 2026 منصة مُتاح - جميع الحقوق محفوظة لأهالي شبين القناطر.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
