import { useState } from 'react'
import './App.css'


function App() {

    const [device, setDevice] = useState(null);
    const [info, setInfo] = useState('');

    const connectToDevice = async () => {
      try {
        const device = await navigator.bluetooth.requestDevice({
          filters: [{ services: ['battery_service'] }],
        });

        setDevice(device);
        setInfo(`Connected to ${device.name}`);
      } catch (error) {
        setInfo(`Error: ${error.message}`);
      }
    };
  

  return (
    <>
      <div className="App">
        <div className="App">
          <button onClick={connectToDevice}>Connect to Device</button>
          <p>{info}</p>
          <p>{device}</p>
        </div>
        <br />
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
