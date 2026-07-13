import { useMemo, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import styled from 'styled-components'
import { Sidebar } from './components/layout/Sidebar'
import { BottomNav } from './components/layout/BottomNav'
import { NavContext } from './context/navContext'
import { Home } from './routes/Home'
import { Favorites } from './routes/Favorites'
import { WorldMap } from './routes/WorldMap'
import { Alerts } from './routes/Alerts'
import { Settings } from './routes/Settings'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof window !== 'undefined' && window.innerWidth >= 1024,
  )
  const navValue = useMemo(
    () => ({
      openNav: () => setSidebarOpen(true),
      toggleNav: () => setSidebarOpen((prev) => !prev),
      closeNav: () => setSidebarOpen(false),
    }),
    [],
  )
  return (
    <NavContext.Provider value={navValue}>
      <Shell>
        <Sidebar
          $open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onOpen={() => setSidebarOpen(true)}
        />
        {sidebarOpen && <Backdrop onClick={() => setSidebarOpen(false)} aria-hidden />}
        <Main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/map" element={<WorldMap />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Main>
        <BottomNav />
      </Shell>
    </NavContext.Provider>
  )
}

const Shell = styled.div`
  display: flex;
  min-height: 100vh;
`

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 45;
  background: oklch(0 0 0 / 0.5);
  -webkit-backdrop-filter: blur(2px);
  backdrop-filter: blur(2px);

  @media (min-width: 1024px) {
    display: none;
  }
`

const Main = styled.main`
  flex: 1;
  min-width: 0;
  padding-bottom: 3.75rem;

  @media (min-width: 1024px) {
    padding-bottom: 0;
  }

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
