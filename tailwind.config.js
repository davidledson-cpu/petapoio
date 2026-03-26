/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
      content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/**/*.{js,ts,jsx,tsx,mdx}',
      ],
      theme: {
    container: {
      center: true,
              padding: '2rem',
              screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
                  input: 'hsl(var(--input))',
                  ring: 'hsl(var(--ring))',
                  background: 'hsl(var(--background))',
                  foreground: 'hsl(var(--foreground))',
                  primary: {
          DEFAULT: '#6BA3BE',
                      dark: '#4d87a5',
                      light: '#EBF4F9',
                      foreground: '#ffffff',
            },
                    secondary: {
          DEFAULT: '#8FB996',
                      dark: '#6fa07a',
                      foreground: '#ffffff',
            },
                    accent: {
          DEFAULT: '#F5ECD7',
                      dark: '#e8d9bc',
                      foreground: '#3D3D3D',
            },
                    muted: {
          DEFAULT: 'hsl(var(--muted))',
                      foreground: 'hsl(var(--muted-foreground))',
            },
                    petblue: {
          50:  '#EBF4F9',
                      100: '#D5E8F0',
                      200: '#AACFE0',
                      300: '#80B6D1',
                      400: '#6BA3BE',
                      500: '#4d87a5',
                      600: '#2C5F7A',
                      700: '#1e4457',
                      800: '#142e3b',
                      900: '#0a171e',
            },
                    petgreen: {
          50:  '#E8F5EB',
                      100: '#D0EBD5',
                      200: '#A1D7AA',
                      300: '#8FB996',
                      400: '#6FA07A',
                      500: '#4e875e',
            },
                    petbeige: {
          50:  '#FBF6EE',
                      100: '#F5ECD7',
                      200: '#E8D9BC',
                      300: '#D4BF93',
            },
      },
      fontFamily: {
        sans:  ['var(--font-lato)', 'sans-serif'],
                  serif: ['var(--font-playfair)', 'serif'],
          },
                borderRadius: {
        lg: 'var(--radius)',
                  md: 'calc(var(--radius) - 2px)',
                  sm: 'calc(var(--radius) - 4px)',
          },
                keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
                      '50%': { transform: 'translateY(-12px)' },
                      },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
                      to:   { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
                  'accordion-up': 'accordion-up 0.2s ease-out',
                  float: 'float 4s ease-in-out infinite',
                  'fade-up': 'fade-up 0.5s ease-out',
                  shimmer: 'shimmer 2s infinite',
          },
                },
    },
  plugins: [require('tailwindcss-animate')],
    }
