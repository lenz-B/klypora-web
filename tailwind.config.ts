/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'], // Enable dark mode with .dark class
  content: [
    './pages//*.{js,jsx,ts,tsx}',
    './components//*.{js,jsx,ts,tsx}',
    './app//*.{js,jsx,ts,tsx}',
    './src//*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Direct OKLCH mappings from :root
        'bg-dark': 'var(--bg-dark)',
        'bg': 'var(--bg)',
        'bg-light': 'var(--bg-light)',
        'text': 'var(--text)',
        'text-muted': 'var(--text-muted)',
        'text-subtle': 'var(--text-subtle)',
        'highlight': 'var(--highlight)',
        'border-muted': 'var(--border-muted)',
        'danger': 'var(--danger)',
        'warning': 'var(--warning)',
        'success': 'var(--success)',
        'info': 'var(--info)',

        // Use OKLCH directly, avoid HSL wrapping
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primaryq)', // OKLCH color
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)', // OKLCH color
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)', // Fixed syntax
          dark: 'var(--accent-dark)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        gray: {
          100: 'var(--gray-100)',
          70: 'var(--gray-70)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        chart: {
          1: 'var(--chart-1)',
          2: 'var(--chart-2)',
          3: 'var(--chart-3)',
          4: 'var(--chart-4)',
          5: 'var(--chart-5)',
        },
        sidebar: {
          DEFAULT: 'var(--sidebar)',
          foreground: 'var(--sidebar-foreground)',
          primary: 'var(--primary)', // Reuse primary
          'primary-foreground': 'var(--primary-foreground)',
          accent: 'var(--secondary)', // Reuse secondary
          'accent-foreground': 'var(--secondary-foreground)',
          border: 'var(--sidebar-border)',
          ring: 'var(--ring)', // Reuse global ring
        },
      },

      // Font settings (unchanged)
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'heading-lg': ['1.25rem', { lineHeight: '1.4', fontWeight: '700' }],
        'heading-md': ['1rem', { lineHeight: '1.4', fontWeight: '700' }],
        'body': ['1rem', { lineHeight: '1.4', fontWeight: '400' }],
        'caption': ['0.875rem', { lineHeight: '1.4', fontWeight: '400' }],
      },

      // Border radius (unchanged)
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      // Box shadow (unchanged)
      boxShadow: {
        input: 'var(--shadow-input)',
        sm: 'var(--shadow-sm)',
        base: 'var(--shadow-base)',
        lg: 'var(--shadow-lg)',
      },

      // Spacing system (added --space-lg)
      spacing: {
        xs: 'var(--space-xs)',
        sm: 'var(--space-sm)',
        md: 'var(--space-md)',
        lg: 'var(--space-lg)', // Added for stack-lg and animations
        xl: 'var(--space-xl)',
        '2xl': 'var(--space-2xl)',
        '3xl': 'var(--space-3xl)',
      },

      // Transition durations (unchanged)
      transitionDuration: {
        fast: '150ms',
        base: '200ms',
        slow: '300ms',
      },

      // Animations (replaced --transition-base with base duration)
      animation: {
        'fade-in': 'fadeIn 200ms',
        'slide-up': 'slideUp 200ms',
        'slide-down': 'slideDown 200ms',
        'scale-in': 'scaleIn 200ms',
      },

      // Keyframes (unchanged)
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(var(--space-lg))',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideDown: {
          '0%': {
            opacity: '0',
            transform: 'translateY(calc(-1 * var(--space-lg)))',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        scaleIn: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.95)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),

    // Custom utilities plugin
    function ({ addUtilities }) {
      addUtilities({
        // Layout utilities
        '.flex-center': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        '.flex-between': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        '.flex-start': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
        },
        '.flex-end': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        },

        // Stack utilities
        '.stack-xs > * + *': { marginTop: 'var(--space-xs)' },
        '.stack-sm > * + *': { marginTop: 'var(--space-sm)' },
        '.stack-md > * + *': { marginTop: 'var(--space-md)' },
        '.stack-lg > * + *': { marginTop: 'var(--space-lg)' },
        '.stack-xl > * + *': { marginTop: 'var(--space-xl)' },

        // Gradients (added fallback for --primary-dark)
        '.gradient-primary': {
          background: 'linear-gradient(135deg, var(--primary), var(--primary-dark, var(--primary)))',
        },
        '.gradient-surface': {
          background: 'linear-gradient(135deg, var(--bg), var(--bg-light))',
        },

        // Accessibility utility
        '.sr-only': {
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: '0',
        },
      });
    },
  ],
};