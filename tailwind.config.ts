import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ============================================================================
      // COLOR PALETTE - WCAG 2.1 AA COMPLIANT
      // ============================================================================
      colors: {
        // PRIMARY COLORS - Democratic Blue (Trust, Civic Engagement)
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },

        // SECONDARY COLORS - Warm Amber
        secondary: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },

        // SEMANTIC COLORS
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },

        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },

        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },

        info: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },

        // NEUTRAL COLORS
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },

        // BACKGROUND & SURFACE COLORS
        background: {
          DEFAULT: '#ffffff',
          light: '#f8fafc',
          dark: '#0f172a',
        },

        surface: {
          DEFAULT: '#ffffff',
          elevated: '#ffffff',
          hover: '#f8fafc',
        },

        // TEXT COLORS
        text: {
          primary: '#0f172a',
          secondary: '#334155',
          tertiary: '#64748b',
          disabled: '#94a3b8',
          inverse: '#ffffff',
        },

        // BORDER COLORS
        border: {
          DEFAULT: '#e2e8f0',
          light: '#f1f5f9',
          dark: '#cbd5e1',
          focus: '#3b82f6',
        },
      },

      // ============================================================================
      // TYPOGRAPHY SCALE
      // ============================================================================
      fontSize: {
        // Display sizes - Hero headings
        'display-2xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-xl': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.015em', fontWeight: '700' }],
        'display-lg': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],

        // Heading sizes
        'heading-xl': ['1.875rem', { lineHeight: '1.3', fontWeight: '700' }],
        'heading-lg': ['1.5rem', { lineHeight: '1.35', fontWeight: '700' }],
        'heading-md': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'heading-sm': ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }],

        // Body text sizes
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],

        // Caption/label sizes
        'caption-md': ['0.875rem', { lineHeight: '1.4', fontWeight: '500' }],
        'caption-sm': ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],

        // Overline/button sizes
        'overline': ['0.75rem', { lineHeight: '1.4', fontWeight: '600', letterSpacing: '0.05em' }],
      },

      // Text transform
      textTransform: {
        'uppercase': 'uppercase',
      },

      // ============================================================================
      // SPACING SYSTEM
      // ============================================================================
      spacing: {
        'section': '5rem',
        'container': '2rem',
        'form': '1.5rem',
      },

      // ============================================================================
      // BORDER RADIUS
      // ============================================================================
      borderRadius: {
        'button': '0.5rem',
        'card': '0.75rem',
        'input': '0.375rem',
        'modal': '1rem',
        'badge': '9999px',
      },

      // ============================================================================
      // BREAKPOINTS - Mobile-first responsive design
      // ============================================================================
      screens: {
        'mobile': '375px',
        'tablet': '768px',
        'desktop': '1024px',
      },

      // ============================================================================
      // SHADOWS
      // ============================================================================
      boxShadow: {
        'button': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'modal': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'focus': '0 0 0 3px rgb(59 130 246 / 0.3)',
      },

      // ============================================================================
      // Z-INDEX LAYERING
      // ============================================================================
      zIndex: {
        'base': '0' as any,
        'dropdown': '1000' as any,
        'sticky': '1100' as any,
        'fixed': '1200' as any,
        'modal-backdrop': '1300' as any,
        'modal': '1400' as any,
        'popover': '1500' as any,
        'tooltip': '1600' as any,
      },

      // ============================================================================
      // FOCUS STYLES
      // ============================================================================
      outline: {
        'focus-ring': '3px solid #3b82f6',
      },
      ringWidth: {
        'focus': '3px',
      },
      ringColor: {
        'focus': '#3b82f6',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
