/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // Bu satır Tailwind'in hangi dosyalarda sınıfları arayacağını belirtir
  ],
  darkMode: "class", // dark mode class tabanlı
  theme: {
    extend: {
      colors: {
        'surface-light': '#e5e7eb',//BG 
        'surface-dark': '#101828',//BG //#111827
        'surface-white': '#ffffff',//BG    
        'surface-black': '#171f2f',//BG //#030712
        
        'main-white': '#111827',//TEXT   
        'main-black': '#f3f4f6',//TEXT   
        'main-light': '#374151',//TEXT   
        'main-dark': '#e5e7eb',//TEXT  
        
        'surface-green-light':'#16a34a',//BG
        'surface-green-dark':'#16a34a',//BG
        'surface-green-light-hover':'#16a34a',//BG
        'surface-green-dark-hover':'#14532d',//BG

        'main-green-light':'#16a34a',//TEXT
        'main-green-dark':'#16a34a',//TEXT
        'main-green-light-hover':'#16a34a',//TEXT
        'main-green-dark-hover':'#14532d',//TEXT


       
      },
      animation: {
        "slide-in": "slideIn 0.3s ease-out forwards",
        "slide-in-reverse": "slideInReverse 0.3s ease-in forwards",
      },
      keyframes: {
        slideIn: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInReverse: {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(-20px)", opacity: "0" },
        },
      },
    },
    screens: {
      'xs': '500px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
  },
  plugins: [],
}

