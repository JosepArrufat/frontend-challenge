import { Routes, Route } from 'react-router-dom'
import styled from 'styled-components'
import { Sidebar } from './components/layout/Sidebar'
import { Home } from './routes/Home'
import { Favorites } from './routes/Favorites'
import { WorldMap } from './routes/WorldMap'
import { Alerts } from './routes/Alerts'
import { Settings } from './routes/Settings'

export default function App() {
  return (
    <Shell>
      <Sidebar />
      <Main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<WorldMap />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Main>
    </Shell>
  )
}

const Shell = styled.div`
  display: flex;
  min-height: 100vh;
`

const Main = styled.main`
  flex: 1;
  min-width: 0;
  background:
    radial-gradient(
      900px 520px at 18% -10%,
      color-mix(in oklab, ${({ theme }) => theme.color.primary} 14%, transparent),
      transparent 60%
    ),
    radial-gradient(
      760px 520px at 100% 0%,
      color-mix(in oklab, ${({ theme }) => theme.color.primary} 8%, transparent),
      transparent 58%
    ),
    ${({ theme }) => theme.color.surface};
`
