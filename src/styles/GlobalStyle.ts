import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body, #root {
    height: 100%;
  }

  body {
    font-family: ${({ theme }) => theme.font.sans};
    background:
      radial-gradient(900px 520px at 12% -12%, oklch(0.62 0.2 256 / 0.18), transparent 62%),
      radial-gradient(760px 520px at 102% 0%, oklch(0.72 0.19 52 / 0.12), transparent 58%),
      ${({ theme }) => theme.color.background};
    color: ${({ theme }) => theme.color.foreground};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    font: inherit;
    cursor: pointer;
    border: none;
    background: none;
    color: inherit;
  }

  ul {
    list-style: none;
  }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.ring};
    outline-offset: 2px;
    border-radius: ${({ theme }) => theme.radius.xs};
  }

  ::selection {
    background: oklch(0.62 0.2 256 / 0.35);
    color: ${({ theme }) => theme.color.foreground};
  }

  * {
    scrollbar-width: thin;
    scrollbar-color: oklch(1 0 0 / 0.18) transparent;
  }

  *::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  *::-webkit-scrollbar-thumb {
    background: oklch(1 0 0 / 0.18);
    border-radius: 9999px;
    border: 2px solid transparent;
    background-clip: content-box;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`
