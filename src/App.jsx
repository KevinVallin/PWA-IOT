import { useState } from 'react'
import './App.css'


function App() {

  const [device, setDevice] = useState(null);
  const [info, setInfo] = useState('');
  const [writeCharacteristic, setWriteCharacteristic] = useState(null);
  const [server, setServer] = useState(null);

  const connectToDevice = async () => {
    try {
      const valueToSend = new TextEncoder().encode('ON')
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: "ESP groupe 3" }],
        optionalServices: ['4fafc201-1fb5-459e-8fcc-c5c9c331914b']
      });
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService('4fafc201-1fb5-459e-8fcc-c5c9c331914b');
      const writeCharacteristic = await service.getCharacteristic('beb5483e-36e1-4688-b7f5-ea07361b26a8');

      device.addEventListener('gattserverdisconnected', () => {
        setInfo('Device disconnected');
        setDevice(null);
        setServer(null);
        setWriteCharacteristic(null);
      });

      setDevice(device);
      setServer(server);
      setWriteCharacteristic(writeCharacteristic,);
      setInfo(`Connected to ${device.name}`);
    } catch (error) {
      setInfo(`Error: ${error.message}`);
    }
  };

  const handleButtonClick = async (value) => {
    if (!writeCharacteristic) {
      setInfo("Error: Not connected to device");
      return;
    }

    try {
      const data = new TextEncoder().encode(value)
      await writeCharacteristic.writeValue(data);
      setInfo(`Sent value: ${value} && ${JSON.stringify(data)}`);
    } catch (error) {
      setInfo(`Error: ${error.message}`);
    }
  }

  return (
    <>
      <div className="App">
        <div className="App">
          <button onClick={connectToDevice}>Connect to Device</button>
          <p>{info}</p>
          <p>{JSON.stringify(device)}</p>
        </div>
        {/*10030200501455035056*/}
        <br />
        <div className="App">
          <button onClick={() => handleButtonClick(1)}>Allumez LED 1</button>
        </div>
        <br />
        <div className="App">
          <button onClick={() => handleButtonClick(2)}>Allumez LED 2</button>
        </div>
        <br />
        <div className="App">
          <button onClick={() => handleButtonClick(3)}>Allumez LED 3</button>
        </div>
        <br />
      </div >
    </>
  )
}

export default App
