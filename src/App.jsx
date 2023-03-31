import { useState } from 'react'
import './App.css'


function App() {

  const [device, setDevice] = useState(null);
  const [info, setInfo] = useState('');
  const [writeCharacteristic, setWriteCharacteristic] = useState(null);
  const [server, setServer] = useState(null);
  const [redValue, setRedValue] = useState('');
  const [blueValue, setBlueValue] = useState('');
  const [greenValue, setGreenValue] = useState('');


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

  const connectToDeviceWifi = async () => {
    fetch('http://192.168.1.194', {
      method: 'POST',
      body: '100302005030056'
    });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    handleButtonClick(100, redValue, 200, blueValue, 300, greenValue);
  };

  const handleButtonClick = async (...value) => {
    let data;

    if (value.length === 1) {
      //Make value a single string 
      data = new TextEncoder().encode(value[0]);
    } else {
      //Put every argument in single string
      const concatenatedValue = value.reduce((acc, curr) => acc + curr, '');
      data = new TextEncoder().encode(concatenatedValue);
    }

    if (!writeCharacteristic) {
      setInfo("Error: Not connected to device");
      return;
    }

    try {
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
          <button onClick={connectToDevice}>Connect to Device in bluetooth</button>
          <p>{info}</p>
          <p>{JSON.stringify(device)}</p>
        </div>

        <br />
        <div className="App">
          <button onClick={connectToDeviceWifi}>Connect to Device in Wifi</button>
        </div>
        <br />

        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Allumer LED Red :
              <input type="text" value={redValue} onChange={(event) => setRedValue(event.target.value)} />
            </label>
          </div>
          <div>
            <label>
              Allumer LED Blue :
              <input type="text" value={blueValue} onChange={(event) => setBlueValue(event.target.value)} />
            </label>
          </div>
          <div>
            <label>
              Allumer LED Vert :
              <input type="text" value={greenValue} onChange={(event) => setGreenValue(event.target.value)} />
            </label>
          </div>
          <div>
            <input type="submit" value="Send Value" />
          </div>
        </form>

        <div>
          <h3>Lancer la chenille</h3>
          {/* Pin chenille 1002022040340602608018090*/}
          {/* Pin Simple 100202204034060*/}
          <button onClick={() => handleButtonClick(100102102032030)}>Cliquez sur moi !</button>
        </div>
      </div >
    </>
  )
}

export default App
