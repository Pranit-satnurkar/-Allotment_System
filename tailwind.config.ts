import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                "bg-soft": "#F5F3EE",
                "green-primary": "#2F5D50",
                "green-accent": "#A7C4BC",
                "green-light": "#E4EFEC",
                "text-main": "#1C1C1C",
                "text-muted": "#6B7280",
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                devanagari: ["Noto Sans Devanagari", "sans-serif"],
            },
            boxShadow: {
                card: "0 2px 12px 0 rgba(47,93,80,0.08)",
                "card-hover": "0 4px 20px 0 rgba(47,93,80,0.14)",
            },
            borderRadius: {
                xl: "1rem",
                "2xl": "1.25rem",
            },
        },
    },
    plugins: [],
};

export default config;
