import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            boxShadow: {
                'soft': '0 10px 40px -10px rgba(0,0,0,0.05)',
                'glow': '0 0 20px rgba(16, 185, 129, 0.3)',
                'glow-lg': '0 0 30px rgba(16, 185, 129, 0.4)',
                'inner-light': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.4)',
            },
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
            fontFamily: {
                sans: ['var(--font-outfit)'],
            }
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};
export default config;
