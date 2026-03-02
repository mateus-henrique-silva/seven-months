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
        pink: {
          50: "#FFF0F5",
          100: "#FFD6E7",
          200: "#FFB3C6",
          300: "#FF8FAB",
          400: "#FF6B90",
          500: "#FF4777",
          600: "#E5365F",
          700: "#CC2449",
          800: "#A01C39",
          900: "#7A1429",
        },
        rose: {
          blush: "#FFB3C6",
          light: "#FFF0F5",
          soft: "#FFD1DC",
        },
        cream: "#FFF9F9",
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "serif"],
        nunito: ["var(--font-nunito)", "sans-serif"],
      },
      animation: {
        "wag-tail": "wagTail 0.5s ease-in-out infinite alternate",
        "wag-tail-fast": "wagTail 0.2s ease-in-out infinite alternate",
        "float": "float 3s ease-in-out infinite",
        "float-slow": "float 5s ease-in-out infinite",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        "tulip-sway": "tulipSway 4s ease-in-out infinite alternate",
      },
      keyframes: {
        wagTail: {
          "0%": { transform: "rotate(-20deg)" },
          "100%": { transform: "rotate(20deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        tulipSway: {
          "0%": { transform: "rotate(-5deg)" },
          "100%": { transform: "rotate(5deg)" },
        },
      },
      backgroundImage: {
        "pink-gradient": "linear-gradient(135deg, #FFF0F5 0%, #FFD6E7 50%, #FFF0F5 100%)",
        "rose-gradient": "linear-gradient(180deg, #FFF0F5 0%, #FFDCE8 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
