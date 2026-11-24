"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Send, MessageSquare, Loader2 } from "lucide-react";

interface MessageItem {
    id: string;
    created_at: string;
    listing_id: string;
    sender_id: string;
    receiver_id: string;
    content: string;
    listings?: { title: string };
}

export default function MessagesPage() {
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const [messages, setMessages] = useState<MessageItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
    const [sendingId, setSendingId] = useState<string | null>(null);

    const fetchMessages = async (uid: string) => {
        const { data } = await supabase
            .from("messages")
            .select("*, listings(title)")
            .or(`sender_id.eq.${uid},receiver_id.eq.${uid}`)
            .order("created_at", { ascending: false });

        if (data) setMessages(data);
        setLoading(false);
    };

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (!data.user) {
                router.push("/login");
            } else {
                setUserId(data.user.id);
                fetchMessages(data.user.id);
            }
        });
    }, [router]);

    const handleReply = async (msg: MessageItem) => {
        const text = replyText[msg.id]?.trim();
        if (!text || !userId) return;

        setSendingId(msg.id);
        const otherUserId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id;

        const { error } = await supabase.from("messages").insert({
            listing_id: msg.listing_id,
            sender_id: userId,
            receiver_id: otherUserId,
            content: text,
        });

        if (!error) {
            setReplyText((prev) => ({ ...prev, [msg.id]: "" }));
            await fetchMessages(userId);
        }
        setSendingId(null);
    };
    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 mb-3"
                >
                    <ArrowRight className="w-4 h-4" />
                    <span>العودة للرئيسية</span>
                </Link>

                <div className="flex items-center gap-2.5 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                        <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900">الرسائل والمحادثات</h1>
                        <p className="text-sm text-slate-500">تواصل مباشرة مع المشترين والمعلنين داخل منصة مُتاح</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                        <p className="text-lg font-bold text-slate-800 mb-2">لا توجد رسائل حتى الآن</p>
                        <p className="text-sm text-slate-500">
                            عندما تراسل أحداً بخصوص إعلان أو يراسلك مهتم بإعلانك ستظهر المحادثة هنا.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((msg) => {
                            const isMine = msg.sender_id === userId;
                            return (
                                <div
                                    key={msg.id}
                                    className={`rounded-2xl border p-4 shadow-sm ${isMine
                                            ? "bg-emerald-50/60 border-emerald-200"
                                            : "bg-white border-slate-200"
                                        }`}
                                >
                                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                                        <Link
                                            href={`/listing/${msg.listing_id}`}
                                            className="font-bold text-emerald-700 hover:underline"
                                        >
                                            بخصوص: {msg.listings?.title || "إعلان على مُتاح"}
                                        </Link>
                                        <span>
                                            {isMine ? "أنت" : "رسالة واردة"} •{" "}
                                            {new Date(msg.created_at).toLocaleDateString("ar-EG")}
                                        </span>
                                    </div>

                                    <p className="text-slate-900 text-sm leading-relaxed mb-3">{msg.content}</p>

                                    {!isMine && (
                                        <div className="flex gap-2 pt-2 border-t border-slate-100">
                                            <input
                                                type="text"
                                                placeholder="اكتب ردك هنا..."
                                                value={replyText[msg.id] || ""}
                                                onChange={(e) =>
                                                    setReplyText((prev) => ({ ...prev, [msg.id]: e.target.value }))
                                                }
                                                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            />
                                            <button
                                                onClick={() => handleReply(msg)}
                                                disabled={sendingId === msg.id}
                                                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
                                            >
                                                {sendingId === msg.id ? (
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                ) : (
                                                    <Send className="w-3.5 h-3.5" />
                                                )}
                                                <span>رد</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
