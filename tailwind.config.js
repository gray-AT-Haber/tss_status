// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust based on your file structure
  ],
  theme: {
    extend: {
      // 1. Add custom scale for hover effect
      scale: {
        '102': '1.02',
      },

      // 2. Add keyframes for fast pulse animation
      animation: {
        'pulse-fast': 'pulse-fast 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },

      // Optional: Add custom colors if you want (e.g., branded green/orange)
      colors: {
        'tss-green': '#10b981',
        'tss-orange': '#f97316',
      },
    },
  },

  // 3. Define keyframes for the custom animation
  plugins: [
    function ({ addUtilities, addComponents, theme }) {
      const newUtilities = {
        // Optional: Add hover-scale utility
        '.hover\\:scale-102': {
          'transform': 'scale(1.02)',
          'transition': 'transform 0.2s ease',
        },
      };

      addUtilities(newUtilities);

      // Add keyframes for pulse-fast
      addComponents([
        {
          '@keyframes pulse-fast': {
            '0%, 100%': { opacity: 1 },
            '50%': { opacity: 0.5 },
          },
        },
      ]);
    },
  ],
};