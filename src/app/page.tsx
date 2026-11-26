"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { SHIBIN_VILLAGES } from "@/lib/areas";
import {
  Search,
  MapPin,
  Home,
  Car,
  Wrench,
  PlusCircle,
  CheckCircle2,
  Phone,
  MessageCircle,
  Calendar,
  SlidersHorizontal,
  LogOut,
  LayoutList,
  MessageSquare,
  Store,
  Stethoscope,
  Hammer,
  Tag,
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
    const matchSearch = item.title.includes(searchQuery);
    return matchType && matchCat && matchArea && matchSearch;
  });
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-xl shadow-sm">
              م<span className="text-emerald-400">.</span>
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                مُتاح
              </span>
              <span className="text-xs font-medium text-emerald-600 block -mt-1">
                Motah • شبين القناطر
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
                  className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-red-600 px-2 py-2 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">خروج</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-sm font-semibold text-slate-700 hover:text-slate-900 px-3 py-2"
              >
                تسجيل الدخول
              </Link>
            )}

            <Link
              href="/add-listing"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>أضف إعلانك</span>
            </Link>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium mb-4">
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

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto mb-8">
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
              <h2 className="font-extrabold text-base sm:text-lg">احجز عيادتك</h2>
              <p className="text-xs text-slate-300 mt-1">احجز برقم دور بدون زحمة</p>
            </Link>

            <Link
              href="/craftsmen"
              className="bg-white/10 hover:bg-white/15 text-white p-4 sm:p-5 rounded-2xl shadow-lg transition flex flex-col items-center text-center border border-white/15"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center mb-2.5">
                <Hammer className="w-6 h-6" />
              </div>
              <h2 className="font-extrabold text-base sm:text-lg">دليل الصنايعية</h2>
              <p className="text-xs text-slate-300 mt-1">سباك، كهربائي، نجار في قريتك</p>
            </Link>
          </div>
          <div className="bg-white rounded-2xl p-3 shadow-2xl text-slate-900 max-w-4xl mx-auto">
            <div className="flex gap-2 mb-3 pb-3 border-b border-slate-100">
              {[
                { id: "all", label: "الكل" },
                { id: "rent", label: "للإيجار" },
                { id: "sale", label: "للبيع" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedType(tab.id as "all" | "sale" | "rent")}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${selectedType === tab.id
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-5 relative flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute right-3" />
                <input
                  type="text"
                  placeholder="ابحث عن شقة، سيارة، معدة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="md:col-span-4 relative flex items-center">
                <MapPin className="w-5 h-5 text-emerald-600 absolute right-3" />
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full pr-10 pl-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {SHIBIN_AREAS.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-3">
                <button className="w-full h-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2">
                  <Search className="w-4 h-4" />
                  <span>ابحث الآن</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="market-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 z-10 w-full">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: "all", name: "جميع الأقسام", icon: SlidersHorizontal },
            { id: "real_estate", name: "عقارات وأراضي", icon: Home },
            { id: "vehicles", name: "سيارات ومركبات", icon: Car },
            { id: "equipment", name: "معدات وأجهزة", icon: Wrench },
          ].map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center justify-center gap-2.5 p-4 rounded-2xl border font-bold text-sm shadow-sm transition ${isActive
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-200 hover:border-emerald-500"
                  }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-emerald-400" : "text-emerald-600"}`} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </section>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">أحدث العروض في شبين القناطر</h2>
            <p className="text-sm text-slate-500 mt-1">
              {loading ? "جاري تحميل الإعلانات..." : `عرض ${filteredListings.length} إعلان متاح حالياً`}
            </p>
          </div>
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
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition duration-300 flex flex-col group"
              >
                <Link
                  href={`/listing/${item.id}`}
                  className="relative aspect-[4/3] overflow-hidden bg-slate-100 block"
                >
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <span
                    className={`absolute top-3 right-3 px-3 py-1 rounded-lg text-xs font-bold text-white shadow-sm ${item.listing_type === "rent" ? "bg-emerald-600" : "bg-blue-600"
                      }`}
                  >
                    {item.listing_type === "rent" ? "للإيجار" : "للبيع"}
                  </span>
                </Link>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        {item.area}
                      </span>
                      {item.is_verified && (
                        <span className="flex items-center gap-1 text-blue-600 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          موثق
                        </span>
                      )}
                    </div>

                    <Link href={`/listing/${item.id}`}>
                      <h3 className="font-bold text-slate-900 text-base line-clamp-2 mb-3 group-hover:text-emerald-700 transition">
                        {item.title}
                      </h3>
                    </Link>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {item.specs?.map((spec, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <div className="flex items-baseline justify-between mb-3">
                      <div>
                        <span className="text-lg font-extrabold text-slate-900">
                          {Number(item.price).toLocaleString()} ج.م
                        </span>
                        {item.rent_period && (
                          <span className="text-xs text-slate-500 mr-1">/ {item.rent_period}</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <a
                        href={`https://wa.me/2${item.phone}?text=${encodeURIComponent(`مرحباً، أود حجز موعد بخصوص إعلانك على منصة متاح: ${item.title}`)}`}

                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>حجز</span>
                      </a>
                      <a
                        href={`https://wa.me/2${item.phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>واتساب</span>
                      </a>
                      <a
                        href={`tel:${item.phone}`}
                        className="flex items-center justify-center gap-1 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold transition"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>اتصال</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-center text-sm">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-bold text-white text-base mb-1">منصة مُتاح (Motah)</p>
          <p>نربط البائعين والمؤجرين بأهالي مدينة شبين القناطر وجميع القرى المجاورة بكل أمان وسهولة.</p>
        </div>
      </footer>
    </div>
  );
}
