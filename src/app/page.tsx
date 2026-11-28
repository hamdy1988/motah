"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { SHIBIN_VILLAGES } from "@/lib/areas";
import Logo from "@/components/Logo";
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

export const LISTING_CATEGORIES = [
  "عقارات وأراضي",
  "شقق ومحلات للإيجار",
  "سيارات ومركبات",
  "موتوسيكلات وتروسيكلات وتكاتك",
  "قطع غيار وإكسسوارات سيارات",
  "موبايلات وتابلت",
  "كمبيوتر ولابتوب وإلكترونيات",
  "أثاث ومفروشات منزلية",
  "أجهزة كهربائية ومنزلية",
  "وظائف وفرص عمل",
  "تعليم ودروس خصوصية",
  "معدات وآلات صناعية",
  "معدات زراعية ومواشي وطيور",
  "ملابس وأحذية وإكسسوارات",
  "مستلزمات أطفال وألعاب",
  "مستلزمات طبية وتجميل",
  "رياضة وهوايات",
  "كتب وأدوات مكتبية",
  "خدمات ونقل عفش",
  "أقسام أخرى",
];
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
        .order("is_verified", { ascending: false })
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
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/">
            <Logo />
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
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center mb-2.5">
                <Hammer className="w-6 h-6" />
              </div>
              <h2 className="font-extrabold text-base sm:text-lg">الصنايعية والحرفيين</h2>
              <p className="text-xs text-slate-300 mt-1">سباك، كهربائي، نجار، وأكثر</p>
            </Link>
          </div>
        </div>
      </section>
      <main id="market-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "الكل" },
              { id: "sale", label: "للبيع" },
              { id: "rent", label: "للإيجار" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedType(tab.id as "all" | "sale" | "rent")}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition ${selectedType === tab.id
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
            <div className="md:col-span-4 relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute right-3" />
              <input
                type="text"
                placeholder="اكتب ما تبحث عنه..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="md:col-span-3 relative flex items-center">
              <Filter className="w-4 h-4 text-emerald-600 absolute right-3" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pr-9 pl-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">جميع الأقسام</option>
                {LISTING_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3 relative flex items-center">
              <MapPin className="w-4 h-4 text-emerald-600 absolute right-3" />
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full pr-9 pl-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {SHIBIN_AREAS.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("listings-results");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full h-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 transition"
              >
                <Search className="w-4 h-4" />
                <span>بحث</span>
              </button>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-l from-emerald-600 via-teal-700 to-slate-900 p-5 sm:p-6 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-right">
            <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-white/15 items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold">
                صاحب عيادة أو محل أو مكتب عقارات في شبين القناطر؟
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100 mt-0.5">
                ثبّت إعلانك أو متجرك في صدارة الموقع ليراه آلاف الأهالي يومياً!
              </p>
            </div>
          </div>
          <a
            href="https://whatsapp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs sm:text-sm transition shadow-sm"
          >
            ميّز إعلانك الآن
          </a>

        </div>
        <div id="listings-results">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <span>أحدث الإعلانات المتاحة</span>
            </h2>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-100 text-slate-600">
              {loading ? "جاري التحميل..." : `${filteredListings.length} إعلان`}
            </span>
          </div>

          {!loading && filteredListings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <p className="text-lg font-bold text-slate-800 mb-2">لا توجد إعلانات مطابقة لبحثك حالياً</p>
              <p className="text-sm text-slate-500 mb-6">كن أول من يضيف إعلاناً في هذا القسم أو هذه القرية!</p>
              <Link
                href="/add-listing"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-3 rounded-xl transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>أضف أول إعلان الآن</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredListings.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl border overflow-hidden hover:shadow-xl transition duration-300 flex flex-col group ${item.is_verified ? "border-amber-300 ring-1 ring-amber-200/60" : "border-slate-200"
                    }`}
                >
                  <Link
                    href={`/listing/${item.id}`}
                    className="relative aspect-[4/3] overflow-hidden bg-slate-100 block"
                  >
                    <img
                      src={item.image_url || "https://placehold.co"}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <span
                      className={`absolute top-3 right-3 px-3 py-1 rounded-lg text-xs font-bold text-white shadow-sm ${item.listing_type === "rent" ? "bg-emerald-600" : "bg-sky-600"
                        }`}
                    >
                      {item.listing_type === "rent" ? "للإيجار" : "للبيع"}
                    </span>

                    {item.is_verified && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-amber-400 text-slate-950 shadow-sm inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>مميز</span>
                      </span>
                    )}
                  </Link>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-center justify-between gap-2 text-xs font-semibold text-slate-500 mb-1.5">
                      <span className="inline-flex items-center gap-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{item.area}</span>
                      </span>
                      {item.category && (
                        <span className="shrink-0 bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[11px]">
                          {item.category}
                        </span>
                      )}
                    </div>

                    <Link href={`/listing/${item.id}`}>
                      <h3 className="font-extrabold text-slate-900 text-base line-clamp-2 group-hover:text-emerald-700 transition mb-2">
                        {item.title}
                      </h3>
                    </Link>

                    <div className="mt-auto pt-3 border-t border-slate-100">
                      <p className="text-lg font-extrabold text-emerald-700 mb-3">
                        {Number(item.price).toLocaleString("ar-EG")}{" "}
                        <span className="text-xs font-bold text-slate-500">
                          ج.م {item.listing_type === "rent" && item.rent_period ? `/ ${item.rent_period}` : ""}
                        </span>
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={`tel:${item.phone}`}
                          className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                        >
                          <Phone className="w-3.5 h-3.5 text-slate-700" />
                          <span>اتصال</span>
                        </a>
                        <a
                          href={`https://wa.me{item.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`مرحباً، بخصوص إعلانك "${item.title}" على منصة مُتاح`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>واتساب</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
