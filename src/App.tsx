import { Routes, Route } from 'react-router-dom'
import styled from 'styled-components'
import { AppHeader } from './components/layout/AppHeader'
import { Home } from './routes/Home'
import { Favorites } from './routes/Favorites'

const Main = styled.main`
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.5rem;
`

export default function App() {
  return (
    <>
      <AppHeader />
      <Main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </Main>
    </>
  )
}
