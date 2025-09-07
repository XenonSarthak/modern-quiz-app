import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Modern Quiz App",
    description:
        "A modern and responsive quiz application built with React and Next.js, where you can test your knowledge with questions from various categories and difficulties.",
    authors: [{ name: "Md Faizan Khan" }],
    keywords: [
        "quiz",
        "react",
        "next.js",
        "typescript",
        "tailwind css",
        "trivia",
    ],
    openGraph: {
        title: "Modern Quiz App by Faizan Khan",
        description:
            "A modern and responsive quiz application to test your knowledge.",
        url: "https://thefznkhan-quiz-app.vercel.app",
        siteName: "Modern Quiz App",
        images: [
            {
                url: "https://thefznkhan-quiz-app.vercel.app/og-image.png",
                width: 1200,
                height: 630,
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Modern Quiz App by Faizan Khan",
        description:
            "A modern and responsive quiz application to test your knowledge.",
        creator: "@thefznkhan",
        images: ["https://thefznkhan-quiz-app.vercel.app/og-image.png"],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}
            >
                {children}
                <Analytics />
            </body>
        </html>
    );
}
