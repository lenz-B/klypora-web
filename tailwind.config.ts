/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // === YOUR EXISTING COLORS (Kept exactly the same) ===
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
       
        // === SHADCN COMPATIBILITY (Optimized but unchanged) ===
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: 'color(oklch var(--accent))',
          dark: 'color(oklch var(--accent-dark))',
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        gray: {
          100: 'var(--gray-100)',
          70: 'var(--gray-70)',
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      
      // === YOUR EXISTING FONT SETTINGS (Kept the same) ===
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'heading-lg': ['1.25rem', { lineHeight: '1.4', fontWeight: '700' }],
        'heading-md': ['1rem', { lineHeight: '1.4', fontWeight: '700' }],
        'body': ['1rem', { lineHeight: '1.4', fontWeight: '400' }],
        'caption': ['0.875rem', { lineHeight: '1.4', fontWeight: '400' }],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        input: "var(--shadow-input)",
      },
      
      // === PERFORMANCE ENHANCEMENTS (New optimizations) ===
      
      // Enhanced spacing system
      spacing: {
        'xs': 'var(--space-xs)',
        'sm': 'var(--space-sm)', 
        'md': 'var(--space-md)',
        'xl': 'var(--space-xl)',
        '2xl': 'var(--space-2xl)',
        '3xl': 'var(--space-3xl)',
      },
      
      // Enhanced shadow system
      boxShadow: {
        'input': 'var(--shadow-input)',
        'sm': 'var(--shadow-sm)',
        'base': 'var(--shadow-base)', 
        'lg': 'var(--shadow-lg)',
      },
      
      // Enhanced transitions
      transitionDuration: {
        'fast': '150ms',
        'base': '200ms', 
        'slow': '300ms',
      },
      
      // Enhanced animations
      animation: {
        'fade-in': 'fadeIn var(--transition-base)',
        'slide-up': 'slideUp var(--transition-base)',
        'slide-down': 'slideDown var(--transition-base)',
        'scale-in': 'scaleIn var(--transition-base)',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(var(--space-lg))'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        slideDown: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(calc(-1 * var(--space-lg)))'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        scaleIn: {
          '0%': { 
            opacity: '0',
            transform: 'scale(0.95)'
          },
          '100%': { 
            opacity: '1',
            transform: 'scale(1)'
          },
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    
    // Enhanced performance plugin
    function({ addUtilities, addComponents, theme }) {
      // Add optimized utility classes
      addUtilities({
        // Layout utilities (performance optimized)
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
        
        // Stack utilities for consistent spacing
        '.stack-xs > * + *': { marginTop: 'var(--space-xs)' },
        '.stack-sm > * + *': { marginTop: 'var(--space-sm)' },
        '.stack-md > * + *': { marginTop: 'var(--space-md)' },
        '.stack-lg > * + *': { marginTop: 'var(--space-lg)' },
        '.stack-xl > * + *': { marginTop: 'var(--space-xl)' },
        
        // Performance-optimized gradients
        '.gradient-primary': {
          background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
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
      })
    }
  ],
}