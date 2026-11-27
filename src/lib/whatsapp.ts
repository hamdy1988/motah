export function getWhatsAppUrl(phone: string, text?: string): string {
    const cleaned = (phone || "").replace(/\D/g, "");
    let formatted = cleaned;

    if (cleaned.startsWith("01") && cleaned.length === 11) {
        formatted = "2" + cleaned;
    } else if (cleaned.startsWith("002")) {
        formatted = cleaned.slice(2);
    }

    const base = "https://wa.me" + formatted;

    const defaultSignature =
        "مرحباً، تواصلت معكم عبر منصة مُتاح (دليل شبين القناطر وقراها).";

    const finalMessage = text
        ? `${text}\n\n— عبر منصة مُتاح (شبين القناطر وقراها)`
        : defaultSignature;

    return `${base}?text=${encodeURIComponent(finalMessage)}`;
}
