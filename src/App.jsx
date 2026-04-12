import { useState } from 'react'
import WelcomePage from './pages/WelcomePage'
import CreateAccountPage from './pages/CreateAccountPage'
import DashboardPage from './pages/DashboardPage'
import './App.css'

function App() {
  const [page, setPage] = useState('welcome')

  if (page === 'dashboard') return <DashboardPage />
  if (page === 'create') return <CreateAccountPage onComplete={() => setPage('dashboard')} />
  return <WelcomePage onCreateAccount={() => setPage('create')} />
}

export default App
