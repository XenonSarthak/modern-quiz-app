import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function decodeHtml(html: string) {
    if (typeof window === "undefined") {
        return html
            .replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'")
            .replace(/&amp;/g, "&");
    }
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}
