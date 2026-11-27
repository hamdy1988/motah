"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { SHIBIN_VILLAGES } from "@/lib/areas";
import {
  Search,
  MapPin,
  PlusCircle,
  CheckCircle2,
  Phone,
  MessageCircle,
  LogOut,
  LayoutList,
  MessageSquare,
  Store,
  Stethoscope,
  Hammer,
  Tag,
  Sparkles,
  Filter,
} from "lucide-react";

const SHIBIN_AREAS = ["كل شبين القناطر وقراها", ...SHIBIN_VILLAGES];

interface Listing {
  id: string;
  title: string;
  listing_type: "rent" | "sale";
  category: string;
  price: number;
  rent_period: string | null;
  area: string;
  phone: string;
  specs: string[];
  image_url: string;
  is_verified: boolean;
}

export default function HomePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [selectedType, setSelectedType] = useState<"all" | "sale" | "rent">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedArea, setSelectedArea] = useState<string>("كل شبين القناطر وقراها");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email || null);
    });

    const fetchListings = async () => {
      const { data } = await supabase
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserEmail(null);
  };

  const filteredListings = listings.filter((item) => {
    const matchType = selectedType === "all" || item.listing_type === selectedType;
    const matchCat = selectedCategory === "all" || item.category === selectedCategory;
    const matchArea =
      selectedArea === "كل شبين القناطر وقراها" || item.area === selectedArea;
    const matchSearch = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchType && matchCat && matchArea && matchSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* الهيدر العلوي بالشعار الجديد */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-xl shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <span>م</span>
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 border-2 border-white"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-slate-900">
                  مُتاح
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  Motah
                </span>
              </div>
              <span className="text-xs font-medium text-slate-500 block -mt-1">
                دليل شبين القناطر وقراها
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {userEmail ? (
              <>
                <Link
                  href="/messages"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 px-3 py-2 rounded-xl transition"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span className="hidden sm:inline">الرسائل</span>
                </Link>

                <Link
                  href="/my-listings"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 px-3 py-2 rounded-xl transition"
                >
                  <LayoutList className="w-4 h-4 text-emerald-600" />
                  <span className="hidden sm:inline">إعلاناتي</span>
                </Link>

                <button
                  onClick={handleLogout}
                  title="تسجيل الخروج"
                  className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-red-600 px-2 py-2 rounded-xl hover:bg-red-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">خروج</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-sm font-semibold text-slate-700 hover:text-emerald-700 px-3 py-2 rounded-xl hover:bg-slate-100 transition"
              >
                تسجيل الدخول
              </Link>
            )}

            <Link
              href="/add-listing"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm shadow-emerald-600/20 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>أضف إعلانك</span>
            </Link>
          </div>
        </div>
      </header>
      {/* القسم الترحيبي (Hero) */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold mb-4">
            <MapPin className="w-3.5 h-3.5" />
            منصة أهالي شبين القناطر وجميع القرى التابعة لها
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-3">
            كل خدمات مدينتك وقريتك..{" "}
            <span className="text-emerald-400">مُتاح</span> بين يديك
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-8">
            اختر القسم الذي تحتاجه: بيع وإيجار مباشر، تصفح المتاجر والمحلات، احجز دورك في العيادة، أو تواصل مع أمهر الصنايعية.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
            <a
              href="#market-section"
              className="bg-emerald-600 hover:bg-emerald-500 text-white p-4 sm:p-5 rounded-2xl shadow-lg transition flex flex-col items-center text-center border border-emerald-400/30"
            >
              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mb-2.5">
                <Tag className="w-6 h-6 text-white" />
              </div>
              <h2 className="font-extrabold text-base sm:text-lg">البيع والإيجار</h2>
              <p className="text-xs text-emerald-100 mt-1">عقارات، سيارات، ومعدات</p>
            </a>

            <Link
              href="/stores"
              className="bg-white/10 hover:bg-white/15 text-white p-4 sm:p-5 rounded-2xl shadow-lg transition flex flex-col items-center text-center border border-white/15"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center mb-2.5">
                <Store className="w-6 h-6" />
              </div>
              <h2 className="font-extrabold text-base sm:text-lg">المتاجر والمحلات</h2>
              <p className="text-xs text-slate-300 mt-1">تصفح محلات شبين وقراها</p>
            </Link>

            <Link
              href="/clinics"
              className="bg-white/10 hover:bg-white/15 text-white p-4 sm:p-5 rounded-2xl shadow-lg transition flex flex-col items-center text-center border border-white/15"
            >
              <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center mb-2.5">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h2 className="font-extrabold text-base sm:text-lg">العيادات والأطباء</h2>
              <p className="text-xs text-slate-300 mt-1">احجز كشفك بسهولة</p>
            </Link>

            <Link
              href="/craftsmen"
              className="bg-white/10 hover:bg-white/15 text-white p-4 sm:p-5 rounded-2xl shadow-lg transition flex flex-col items-center text-center border border-white/15"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center mb-2.5">
                <Hammer className="w-6 h-6" />
              </div>
              <h2 className="font-extrabold text-base sm:text-lg">الصنايعية والحرف</h2>
              <p className="text-xs text-slate-300 mt-1">سباكة، كهرباء، نجارة والمزيد</p>
            </Link>
          </div>
        </div>
      </section>

      {/* قسم الإعلانات والسوق المفتوح */}
      <main id="market-section" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* شريط البحث والفلاتر المدمج */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-4 sm:p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* حقل البحث */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ابحث عن شقة، سيارة، محل، أو أي غرض..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pr-11 pl-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>

            {/* اختيار المنطقة */}
            <div className="relative sm:w-64">
              <MapPin className="w-4 h-4 text-emerald-600 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-2xl pr-10 pl-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition cursor-pointer"
              >
                {SHIBIN_AREAS.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            {/* أزرار نوع العرض (الكل / بيع / إيجار) */}
            <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl">
              {[
                { id: "all", label: "الكل" },
                { id: "sale", label: "للبيع" },
                { id: "rent", label: "للإيجار" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedType(tab.id as "all" | "sale" | "rent")}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${selectedType === tab.id
                      ? "bg-white text-emerald-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* أزرار التصنيفات السريعة */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 mt-4 border-t border-slate-100 no-scrollbar">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 ml-2 shrink-0">
              <Filter className="w-3.5 h-3.5" />
              التصنيف:
            </span>
            {[
              { id: "all", label: "جميع الأقسام" },
              { id: "real_estate", label: "عقارات وأراضي" },
              { id: "vehicles", label: "سيارات ومركبات" },
              { id: "equipment", label: "معدات وأدوات" },
              { id: "other", label: "أخرى" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition border ${selectedCategory === cat.id
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:text-emerald-700"
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
        {/* عنوان النتائج وعددها */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              أحدث الإعلانات المتاحة
            </h2>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
            {filteredListings.length} إعلان
          </span>
        </div>

        {/* شبكة عرض الإعلانات */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden animate-pulse"
              >
                <div className="h-52 bg-slate-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-slate-200 rounded-lg w-3/4" />
                  <div className="h-4 bg-slate-100 rounded-lg w-1/2" />
                  <div className="h-10 bg-slate-100 rounded-xl w-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto my-8">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mb-1">
              لا توجد إعلانات مطابقة لبحثك
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              جرب تغيير كلمات البحث أو اختيار منطقة وتصنيف مختلف.
            </p>
            <button
              onClick={() => {
                setSelectedType("all");
                setSelectedCategory("all");
                setSelectedArea("كل شبين القناطر وقراها");
                setSearchQuery("");
              }}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition"
            >
              إعادة ضبط الفلاتر
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((item) => {
              const cleanPhone = item.phone?.replace(/\D/g, "") || "";
              const whatsappNumber = cleanPhone.startsWith("0")
                ? `2${cleanPhone}`
                : cleanPhone;

              return (
                <article
                  key={item.id}
                  className="group bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col"
                >
                  {/* صورة الإعلان والشارات */}
                  <div className="relative h-56 bg-slate-100 overflow-hidden">
                    <img
                      src={
                        item.image_url ||
                        "https://unsplash.com"
                      }
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                    {/* شارة نوع العرض */}
                    <span
                      className={`absolute top-3.5 right-3.5 px-3 py-1 rounded-xl text-xs font-extrabold shadow-sm ${item.listing_type === "sale"
                          ? "bg-emerald-600 text-white"
                          : "bg-amber-500 text-slate-950"
                        }`}
                    >
                      {item.listing_type === "sale" ? "للبيع" : "للإيجار"}
                    </span>

                    {/* شارة التوثيق */}
                    {item.is_verified && (
                      <span className="absolute top-3.5 left-3.5 inline-flex items-center gap-1 bg-white/95 backdrop-blur-xs text-emerald-700 px-2.5 py-1 rounded-xl text-xs font-bold shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        موثق
                      </span>
                    )}

                    {/* السعر أسفل الصورة */}
                    <div className="absolute bottom-3.5 right-3.5 left-3.5 flex items-end justify-between text-white">
                      <div>
                        <span className="text-xl font-black tracking-tight">
                          {Number(item.price).toLocaleString("ar-EG")} ج.م
                        </span>
                        {item.listing_type === "rent" && item.rent_period && (
                          <span className="text-xs text-slate-200 mr-1">
                            / {item.rent_period}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* تفاصيل الإعلان */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 mb-2">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{item.area}</span>
                    </div>

                    <Link href={`/listings/${item.id}`}>
                      <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-emerald-700 transition line-clamp-1 mb-3">
                        {item.title}
                      </h3>
                    </Link>

                    {/* المواصفات المختصرة */}
                    {item.specs && item.specs.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {item.specs.slice(0, 3).map((spec, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* أزرار التواصل المباشر */}
                    <div className="mt-auto pt-4 border-t border-slate-100 grid grid-cols-2 gap-2.5">
                      <a
                        href={`tel:${item.phone}`}
                        className="inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-3 rounded-xl transition"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>اتصال</span>
                      </a>

                      <a
                        href={`https://wa.me{whatsappNumber}?text=${encodeURIComponent(
                          `مرحباً، بخصوص إعلانك على منصة مُتاح: ${item.title}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold py-2.5 px-3 rounded-xl transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>واتساب</span>
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* الفوتر */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-4 mt-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black flex items-center justify-center text-sm">
              م
            </span>
            <span className="font-bold text-white">منصة مُتاح</span>
            <span>• جميع الحقوق محفوظة لأهالي شبين القناطر</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/stores" className="hover:text-white transition">
              المتاجر
            </Link>
            <Link href="/clinics" className="hover:text-white transition">
              العيادات
            </Link>
            <Link href="/craftsmen" className="hover:text-white transition">
              الصنايعية
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
