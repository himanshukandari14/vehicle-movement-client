import React from 'react';
import Map from './components/VehicleMap.js';
import car from '../src/assets/car.png';

function App() {
  return (
    <div className="flex flex-col w-full items-center justify-center min-h-screen bg-gray-100">
      <div className="text-3xl font-bold flex flex-col md:flex-row justify-center items-center text-center text-gray-800 mb-6">
        <img src={car} height={70} width={70} alt="Car Icon" className="mb-2 md:mb-0 md:mr-2" />
        <h1 className="text-center">Vehicle Movement Tracker</h1>
        <h1 className="font-thin text-center md:ml-4">by- Himanshu Kandari</h1>
      </div>
      <div className="w-full h-[80vh] md:h-[70vh] rounded-lg shadow-lg overflow-hidden p-4 md:p-6">
        <Map />
      </div>
    </div>
  );
}

export default App;
