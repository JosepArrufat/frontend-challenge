import { ThemeProvider } from 'styled-components'
import { darkTheme, lightTheme } from './styles/theme'
import { GlobalStyle } from './styles/GlobalStyle'
import { UnitProvider } from './context/UnitContext'
import { UserProvider } from './context/UserContext'
import { useUser } from './hooks/useUser'
import { FavoritesProvider } from './context/FavoritesContext'
import { BrowserRouter } from 'react-router-dom'
import { useThemeMode } from './hooks/useThemeMode'
import App from './App'

function AppShell() {
  const { username } = useUser()
  return (
    <FavoritesProvider key={username} username={username}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </FavoritesProvider>
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
