import { ThemeProvider } from 'styled-components'
import { darkTheme, lightTheme } from './styles/theme'
import { GlobalStyle } from './styles/GlobalStyle'
import { UnitProvider } from './context/UnitContext'
import { UserProvider } from './context/UserContext'
import { useUser } from './hooks/useUser'
import { FavoritesProvider } from './context/FavoritesContext'
import { CurrentCityProvider } from './context/CurrentCityContext'
import { BrowserRouter } from 'react-router-dom'
import { useThemeMode } from './hooks/useThemeMode'
import App from './App'

function AppShell() {
  const { username } = useUser()
  return (
    <CurrentCityProvider key={`current-city:${username}`} username={username}>
      <FavoritesProvider key={`favorites:${username}`} username={username}>
        <BrowserRouter basename="/frontend-challenge">
          <App />
        </BrowserRouter>
      </FavoritesProvider>
    </CurrentCityProvider>
  )
}

export function ThemedApp() {
  const { mode } = useThemeMode()
  const theme = mode === 'light' ? lightTheme : darkTheme
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <UnitProvider>
        <UserProvider>
          <AppShell />
        </UserProvider>
      </UnitProvider>
    </ThemeProvider>
  )
}
