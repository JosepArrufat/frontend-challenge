import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease,
      box-shadow 0.25s ease, fill 0.25s ease;
  }

  html, body, #root {
    height: 100%;
  }

  html {
    scrollbar-gutter: stable;
  }

  body {
    font-family: ${({ theme }) => theme.font.sans};
    background: ${({ theme }) => theme.color.background};
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
    background: color-mix(in oklab, ${({ theme }) => theme.color.primary} 35%, transparent);
    color: ${({ theme }) => theme.color.foreground};
  }

  * {
    scrollbar-width: thin;
    scrollbar-color: color-mix(in oklab, ${({ theme }) => theme.color.foreground} 20%, transparent) transparent;
  }

  *::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  *::-webkit-scrollbar-thumb {
    background: color-mix(in oklab, ${({ theme }) => theme.color.foreground} 20%, transparent);
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
