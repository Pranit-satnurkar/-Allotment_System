import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "९१ कल्पवृक्ष पारायण व्यवस्थापन",
    description: "Weekly Chapter Allotment for WhatsApp Reading Group",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="mr">
            <body className="antialiased min-h-screen">
                {children}
            </body>
        </html>
    );
}
