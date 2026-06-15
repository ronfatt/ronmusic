import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#05070d",
        midnight: "#09111f",
        electric: "#3aa8ff",
        gold: "#d9a441",
        pearl: "#f7f2e7"
      },
      boxShadow: {
        glow: "0 0 80px rgba(58, 168, 255, 0.18)",
        gold: "0 0 60px rgba(217, 164, 65, 0.18)"
      },
      backgroundImage: {
        "radial-blue": "radial-gradient(circle at top left, rgba(58,168,255,.28), transparent 34%)",
        "radial-gold": "radial-gradient(circle at top right, rgba(217,164,65,.22), transparent 32%)"
      }
    }
  },
  plugins: []
};

export default config;
