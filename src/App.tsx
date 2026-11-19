
import HomePage from './pages/HomePage'
import IntercambioPage from './pages/IntercambioPage'

export default function App() {
  const vista = new URLSearchParams(
    window.location.search
  ).get('vista')

  if (vista === 'intercambio') {
    return <IntercambioPage />
  }

  return <HomePage />
}
