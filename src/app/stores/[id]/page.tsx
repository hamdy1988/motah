"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
    ArrowRight,
    Store,
    MapPin,
    Phone,
    MessageCircle,
    PlusCircle,
    Trash2,
    Loader2,
    Upload,
} from "lucide-react";

interface StoreInfo {
    id: string;
    user_id: string;
    name: string;
    category: string;
    area: string;
    address: string | null;
    phone: string;
    description: string | null;
}

interface ProductItem {
    id: string;
    title: string;
    price: number;
    image_url: string | null;
}

export default function SingleStorePage() {
    const params = useParams();
    const id = params?.id as string;

    const [store, setStore] = useState<StoreInfo | null>(null);
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [adding, setAdding] = useState(false);

    const fetchStoreData = async () => {
        if (!id) return;
        const { data: storeData } = await supabase
            .from("stores")
            .select("*")
            .eq("id", id)
            .single();

        if (storeData) {
            setStore(storeData);
            const { data: prodData } = await supabase
                .from("store_products")
                .select("*")
                .eq("store_id", id)
                .order("created_at", { ascending: false });

            if (prodData) setProducts(prodData);
        }
        setLoading(false);
    };

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setCurrentUserId(data.user?.id || null);
        });
        fetchStoreData();
    }, [id]);

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!store) return;
        setAdding(true);

        let imageUrl = "https://unsplash.com";

        if (imageFile) {
            const ext = imageFile.name.split(".").pop();
            const fileName = `store-${Date.now()}.${ext}`;
            const { error: upErr } = await supabase.storage
                .from("listings-images")
                .upload(fileName, imageFile);

            if (!upErr) {
                const { data: pubData } = supabase.storage
                    .from("listings-images")
                    .getPublicUrl(fileName);
                imageUrl = pubData.publicUrl;
            }
        }

        const { error } = await supabase.from("store_products").insert({
            store_id: store.id,
            title,
            price: Number(price),
            image_url: imageUrl,
        });

        setAdding(false);
        if (!error) {
            setTitle("");
            setPrice("");
            setImageFile(null);
            fetchStoreData();
        }
    };

    const handleDeleteProduct = async (prodId: string) => {
        await supabase.from("store_products").delete().eq("id", prodId);
        setProducts((prev) => prev.filter((p) => p.id !== prodId));
    };
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            </div>
        );
    }

    if (!store) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">عذراً، هذا المتجر غير موجود</h1>
                <Link href="/stores" className="px-5 py-2.5 bg-amber-500 text-white font-bold rounded-xl">
                    العودة لجميع المتاجر
                </Link>
            </div>
        );
    }

    const isOwner = currentUserId === store.user_id;

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4">
            <div className="max-w-5xl mx-auto">
                <Link
                    href="/stores"
                    className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 mb-4"
                >
                    <ArrowRight className="w-4 h-4" />
                    <span>العودة لجميع المتاجر</span>
                </Link>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-8">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <span className="px-3 py-1 rounded-lg bg-amber-50 text-amber-700 text-xs font-extrabold">
                                {store.category}
                            </span>
                            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2 mb-2">
                                {store.name}
                            </h1>
                            <p className="inline-flex items-center gap-1.5 text-sm text-slate-600 mb-2">
                                <MapPin className="w-4 h-4 text-amber-500" />
                                <span>
                                    {store.area} {store.address ? `• ${store.address}` : ""}
                                </span>
                            </p>
                            {store.description && (
                                <p className="text-sm text-slate-500 max-w-2xl mt-1">{store.description}</p>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <a
                                href={`https://wa.me\${store.phone}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition"
                            >
                                <MessageCircle className="w-4 h-4" />
                                <span>واتساب المحل</span>
                            </a>
                            <a
                                href={`tel:${store.phone}`}
                                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
                            >
                                <Phone className="w-4 h-4" />
                                <span>{store.phone}</span>
                            </a>
                        </div>
                    </div>
                </div>

                {isOwner && (
                    <form
                        onSubmit={handleAddProduct}
                        className="bg-white rounded-2xl border border-amber-200 p-6 mb-8 shadow-sm space-y-4"
                    >
                        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                            <PlusCircle className="w-5 h-5 text-amber-500" />
                            <span>أضف منتجاً أو عرضاً جديداً في متجرك</span>
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <input
                                type="text"
                                required
                                placeholder="اسم المنتج أو العرض"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                            />
                            <input
                                type="number"
                                required
                                placeholder="السعر بالجنيه"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                            />
                            <label className="flex items-center justify-center gap-2 p-2.5 border border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer text-xs font-semibold text-slate-700">
                                <Upload className="w-4 h-4 text-amber-500" />
                                <span>{imageFile ? imageFile.name : "اختر صورة للمنتج"}</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={adding}
                            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                        >
                            {adding && <Loader2 className="w-4 h-4 animate-spin" />}
                            <span>نشر المنتج في المتجر</span>
                        </button>
                    </form>
                )}

                <h2 className="text-xl font-extrabold text-slate-900 mb-4">
                    منتجات وعروض {store.name} ({products.length})
                </h2>

                {products.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500 text-sm">
                        لم يضف صاحب المتجر منتجات بعد. تواصل معه عبر الهاتف أو الواتساب للاستفسار!
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {products.map((prod) => (
                            <div
                                key={prod.id}
                                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between"
                            >
                                <div className="aspect-square bg-slate-100 overflow-hidden">
                                    <img
                                        src={prod.image_url || ""}
                                        alt={prod.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-slate-900 text-sm mb-1">{prod.title}</h3>
                                    <p className="text-base font-extrabold text-amber-600 mb-3">
                                        {Number(prod.price).toLocaleString()} ج.م
                                    </p>
                                    <div className="flex gap-2">
                                        <a
                                            href={`https://wa.me/2${store.phone}?text=${encodeURIComponent(`مرحباً، أود طلب: ${prod.title} من متجر ${store.name}`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold text-center"
                                        >
                                            اطلب واتساب
                                        </a>
                                        {isOwner && (
                                            <button
                                                onClick={() => handleDeleteProduct(prod.id)}
                                                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
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
