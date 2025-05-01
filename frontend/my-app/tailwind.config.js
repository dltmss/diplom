/** @type {import('tailwindcss').Config} */
module.exports = {
  // 1. Тёмный режим по классу .dark
  darkMode: ["class"],

  // 2. Пути до всех файлов, где используются классы tailwind
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      // ваши существующие borderRadius, colors и пр.
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        // 3. Добавляем акцентный цвет из CSS-переменной
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },

      // 4. Привязка своего font-family к CSS-переменной
      fontFamily: {
        sans: "var(--font-family)",
        serif: "var(--font-family)", // при необходимости
        mono: "var(--font-family)", // при необходимости
      },

      // 5. Привязка базового размера текста
      fontSize: {
        base: "var(--font-size-base)",
      },
    },
  },

  plugins: [
    require("tailwindcss-animate"),
    // ... другие ваши плагины
  ],
};
