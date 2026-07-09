import 'styled-components'

export const theme = {
  color: {
    background: 'oklch(0.18 0.004 286)',
    foreground: 'oklch(0.97 0 0)',
    card: 'oklch(1 0 0 / 0.06)',
    cardForeground: 'oklch(0.98 0 0)',
    popover: 'oklch(0.24 0.004 286 / 0.9)',
    popoverForeground: 'oklch(0.97 0 0)',
    primary: 'oklch(0.62 0.2 256)',
    primaryForeground: 'oklch(1 0 0)',
    secondary: 'oklch(1 0 0 / 0.08)',
    secondaryForeground: 'oklch(0.85 0 0)',
    muted: 'oklch(1 0 0 / 0.05)',
    mutedForeground: 'oklch(0.66 0.005 286)',
    accent: 'oklch(1 0 0 / 0.08)',
    accentForeground: 'oklch(0.98 0 0)',
    destructive: 'oklch(0.6 0.22 25)',
    destructiveForeground: 'oklch(1 0 0)',
    signature: 'oklch(0.72 0.19 52)',
    signatureForeground: 'oklch(0.18 0.004 286)',
    border: 'oklch(1 0 0 / 0.1)',
    input: 'oklch(1 0 0 / 0.06)',
    ring: 'oklch(0.62 0.2 256)',
  },
  font: {
    sans: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
  radius: {
    xs: '0.375rem',
    sm: '0.625rem',
    md: '0.75rem',
    lg: '0.875rem',
    xl: '1.125rem',
    '2xl': '1.25rem',
    full: '9999px',
  },
  blur: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  },
  shadow: {
    card: 'inset 0 1px 0 oklch(1 0 0 / 0.05), 0 18px 50px -22px oklch(0 0 0 / 0.75)',
    popover: 'inset 0 1px 0 oklch(1 0 0 / 0.07), 0 24px 60px -24px oklch(0 0 0 / 0.85)',
  },
  glow: {
    primary: '0 12px 34px -10px oklch(0.62 0.2 256 / 0.6)',
    signature: '0 12px 34px -10px oklch(0.72 0.19 52 / 0.5)',
  },
  spacing: (n: number) => `${n * 0.25}rem`,
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
}

type ThemeShape = typeof theme

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeShape {}
}
