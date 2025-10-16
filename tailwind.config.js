module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "bounce-slow": "bounce 8s infinite",
        "spin-slow": "spin 20s linear infinite",
        "gradient-x": "gradient-x 15s ease infinite",
      },
      keyframes: {
        "gradient-x": {
          "0%, 100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
        },
      },
    },
  },
  plugins: [],
};
