/** Colours come from CSS variables in src/index.css so the whole UI can be reskinned in one place. */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)', surface: 'var(--surface)', 'surface-2': 'var(--surface-2)', header: 'var(--header)',
        line: 'var(--line)', 'line-strong': 'var(--line-strong)', ink: 'var(--ink)', 'ink-2': 'var(--ink-2)',
        muted: 'var(--muted)', accent: 'var(--accent)', 'on-accent': 'var(--on-accent)', sel: 'var(--sel)',
        link: 'var(--blue)', warn: 'var(--warn)',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
