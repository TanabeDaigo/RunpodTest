/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // Next.jsのビルトインCSSサポートと互換性を持たせるための設定
  future: {
    hoverOnlyWhenSupported: true,
  },
  // MUIとの互換性を確保するための設定
  important: true,
};
