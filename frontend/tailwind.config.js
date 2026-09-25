/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#080c14',
        deck: '#0d121f',
        'deck-light': '#141b2d',
        'cyan-hud': '#00f0ff',
        'cyan-muted': '#00a3b4',
        'frost-white': '#edf6f9',
        'silver-tactical': '#8d99ae',
        'gold-xp': '#ffd700',
        'green-cyber': '#00ff9d',
        'danger-cyber': '#ff3366',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Share Tech Mono"', 'monospace'],
        sans: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        'hud-glow': '0 0 15px rgba(0, 240, 255, 0.25)',
        'hud-glow-strong': '0 0 25px rgba(0, 240, 255, 0.45)',
        'gold-glow': '0 0 20px rgba(255, 215, 0, 0.4)',
      },
    },
  },
  plugins: [],
}
