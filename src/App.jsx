import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="App">
        <div className="App">
          <button>Allumez LED 1</button>
        </div>
        <br />
        <div className="App">
          <button>Allumez LED 2</button>
        </div>
        <br />
        <div className="App">
          <button>Allumez LED 3</button>
        </div>
        <br />
      </div>
    </>
  )
}

export default App
