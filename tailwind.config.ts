import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "DM Sans", "sans-serif"],
        serif: ["var(--font-serif)", "DM Serif Display", "serif"],
      },
      colors: {
        ink: {
          DEFAULT: "#0e0d0c",
          2: "#3d3b38",
          3: "#6b6966",
          4: "#9b9895",
        },
        surface: {
          DEFAULT: "#faf9f7",
          2: "#f2f0ec",
          3: "#e8e5df",
        },
        accent: {
          DEFAULT: "#1a6b4a",
          2: "#14543b",
          light: "#e6f4ee",
        },
        gold: {
          DEFAULT: "#c8922a",
          light: "#fdf3e0",
        },
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        soft: "0 1px 3px rgba(14,13,12,0.08), 0 4px 16px rgba(14,13,12,0.06)",
        card: "0 2px 8px rgba(14,13,12,0.06), 0 8px 32px rgba(14,13,12,0.04)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 3s linear infinite",
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
