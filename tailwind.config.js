/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';

export default {
  darkMode: 'class',
  content: ['./src/**/*.{html,js,svelte,ts,css}'],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '72ch',
            '--tw-prose-body': '#3D3A3A',
            '--tw-prose-headings': '#111111',
            '--tw-prose-links': '#FA5252',
            '--tw-prose-bold': '#111111',
            '--tw-prose-code': '#111111',
            '--tw-prose-pre-bg': '#1D1D1D',
            'h2': {
              marginTop: '0.5em !important',
              marginBottom: '0.25em !important',
              display: 'flex !important',
              alignItems: 'center !important',
            },
            'h2::after': {
              content: '"" !important',
              display: 'block !important',
              height: '2px !important',
              flex: '1 !important',
              marginLeft: '0.75em !important',
              background: 'linear-gradient(-35deg, transparent, #0d1225, #3e2533, #fa5252, #ff6565) !important',
              backgroundSize: '180% 180% !important',
            },
            'h3,h4': {
              marginTop: '0.75em !important',
              marginBottom: '0.25em !important',
              display: 'flex !important',
              alignItems: 'center !important',
            },
            'h3::after,h4::after': {
              content: '"" !important',
              display: 'block !important',
              height: '2px !important',
              flex: '1 !important',
              marginLeft: '0.75em !important',
              background: 'linear-gradient(-35deg, transparent, #0d1225, #3e2533, #fa5252, #ff6565) !important',
              backgroundSize: '180% 180% !important',
            },
            'ul,ol': {
              marginTop: '0.25em !important',
              marginBottom: '0.25em !important',
            },
            'li': {
              marginTop: '0.125em !important',
              marginBottom: '0.125em !important',
            },
          },
        },
        invert: {
          css: {
            '--tw-prose-body': '#A6A6A6',
            '--tw-prose-headings': '#ffffff',
            '--tw-prose-links': '#FA5252',
            '--tw-prose-bold': '#ffffff',
            '--tw-prose-code': '#f8f8f2',
            '--tw-prose-pre-bg': '#1D1D1D',
            'h2': {
              marginTop: '0.5em !important',
              marginBottom: '0.25em !important',
              display: 'flex !important',
              alignItems: 'center !important',
            },
            'h2::after': {
              content: '"" !important',
              display: 'block !important',
              height: '2px !important',
              flex: '1 !important',
              marginLeft: '0.75em !important',
              background: 'linear-gradient(-35deg, transparent, #0d1225, #3e2533, #fa5252, #ff6565) !important',
              backgroundSize: '180% 180% !important',
            },
            'h3,h4': {
              marginTop: '0.75em !important',
              marginBottom: '0.25em !important',
              display: 'flex !important',
              alignItems: 'center !important',
            },
            'h3::after,h4::after': {
              content: '"" !important',
              display: 'block !important',
              height: '2px !important',
              flex: '1 !important',
              marginLeft: '0.75em !important',
              background: 'linear-gradient(-35deg, transparent, #0d1225, #3e2533, #fa5252, #ff6565) !important',
              backgroundSize: '180% 180% !important',
            },
            'ul,ol': {
              marginTop: '0.25em !important',
              marginBottom: '0.25em !important',
            },
            'li': {
              marginTop: '0.125em !important',
              marginBottom: '0.125em !important',
            },
          },
        },
      },
    },
  },
  plugins: [
    typography,
  ],
}

