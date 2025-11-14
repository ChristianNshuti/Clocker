import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Clock from './Components/Clock'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='app'>
      <Clock />
    </div>
  )
}

export default App
