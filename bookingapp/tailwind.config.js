/** @type {import('tailwindcss').Config} */
module.exports = {
  // Update the paths to include your index.tsx file in the app folder
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",  // Include all JS/TS files in the app folder
    "./screens/**/*.{js,jsx,ts,tsx}", // Keep this line to include all screens
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}
