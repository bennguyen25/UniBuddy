import { useState } from 'react'
import WelcomePage from './pages/WelcomePage'
import CreateAccountPage from './pages/CreateAccountPage'
import './App.css'

function App() {
  const [page, setPage] = useState('welcome')

  if (page === 'create') return <CreateAccountPage />
  return <WelcomePage onCreateAccount={() => setPage('create')} />
}

export default App
