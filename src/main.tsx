import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { theme } from './styles/theme'
import { GlobalStyle } from './styles/GlobalStyle'
import { FavoritesProvider } from './context/FavoritesContext'
import App from './App.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <FavoritesProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </FavoritesProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
