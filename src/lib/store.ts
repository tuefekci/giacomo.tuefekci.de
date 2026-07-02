import { writable } from 'svelte/store';

export const data = writable({});

function createThemeStore() {
  const { subscribe, set, update } = writable<'light' | 'dark'>('light');

  return {
    subscribe,
    set: (value: 'light' | 'dark') => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', value);
        if (value === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      set(value);
    },
    toggle: () => {
      update(current => {
        const next = current === 'light' ? 'dark' : 'light';
        if (typeof window !== 'undefined') {
          localStorage.setItem('theme', next);
          if (next === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
        return next;
      });
    },
    init: () => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
        if (stored) {
          set(stored);
        } else {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          set(prefersDark ? 'dark' : 'light');
        }
      }
    }
  };
}

export const theme = createThemeStore();