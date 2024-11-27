import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        'fadeDown': 'fadeDown 0.5s ease-out forwards',
        'fadeUp': 'fadeUp 0.5s ease-out forwards',
        'fadeIn': 'fadeIn 0.5s ease-out forwards',
      }
    },
  },
  plugins: [],
} satisfies Config;
