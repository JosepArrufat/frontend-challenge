import { ThemeProvider } from 'styled-components'
import { darkTheme, lightTheme } from './styles/theme'
import { GlobalStyle } from './styles/GlobalStyle'
import { UnitProvider } from './context/UnitContext'
import { FavoritesProvider } from './context/FavoritesContext'
import { BrowserRouter } from 'react-router-dom'
import { useThemeMode } from './hooks/useThemeMode'
import App from './App'

export function ThemedApp() {
  const { mode } = useThemeMode()
  const theme = mode === 'light' ? lightTheme : darkTheme
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <UnitProvider>
        <FavoritesProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </FavoritesProvider>
      </UnitProvider>
    </ThemeProvider>
  )
}
