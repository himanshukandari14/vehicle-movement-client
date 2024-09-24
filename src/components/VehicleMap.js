import React, { useEffect, useState } from 'react';
import customMarker from '../assets/car.png';
import { BaseUrl } from '../constant';

const Map = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const [currentPosition, setCurrentPosition] = useState({ lat: 28.6100, lng: 77.2275 });

  // Load the Google Maps script
  const loadScript = () => {
    if (!document.querySelector(`script[src*="maps?.googleapis.com"]`)) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDcyYy5aQ4xUiJyrBCrHU2S69eE_2mpdU8&callback=initMap`; // Replace with your API key
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => setMapLoaded(true);  // Set mapLoaded to true once the script is loaded
    } else {
      setMapLoaded(true); // If the script is already loaded, just set mapLoaded to true
    }
  };

  useEffect(() => {
    loadScript();
    window.initMap = () => {}; // Placeholder to avoid errors when calling the callback
  }, []);



  useEffect(() => {
    if (mapLoaded) {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: currentPosition,
      });

      

      const vehicleMarker = new window.google.maps.Marker({
        position: currentPosition,
        map: map,
        title: "Vehicle Location",
        icon: {
          url: customMarker,
          scaledSize: new window.google.maps.Size(50, 50),
        },
      });

      const path = [];
      let currentIndex = 0;

      // Fetch vehicle location periodically
      const fetchVehicleLocation = async () => {
        setLoading(true);
        try {
          const response = await fetch(`${BaseUrl}api/vehicle-data`); // Replace with your API URL
          const data = await response.json();

          if (currentIndex < data.length) {
            const { latitude, longitude } = data[currentIndex];
            const newPosition = { lat: latitude, lng: longitude };
            setCurrentPosition(newPosition); // Update current position state

            console.log('Vehicle Position:', newPosition); // Debugging position data

            // Smoothly move the marker to the new position
            smoothMarkerTransition(vehicleMarker, newPosition, map);

            // Add to path and draw route
            path.push(newPosition);
            drawRoute(map, path);
            currentIndex++;
          }
        } catch (error) {
          console.error('Error fetching vehicle location:', error);
        }finally{
      setLoading(false); 
    }
      };

      const intervalId = setInterval(fetchVehicleLocation, 1000);

      // Cleanup interval on component unmount
      return () => clearInterval(intervalId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapLoaded]);

  // Function to smoothly transition the marker to a new position
  const smoothMarkerTransition = (marker, newPosition, map) => {
    const numSteps = 50; 
    const timePerStep = 50; 
    const startPosition = marker.getPosition();
    const latDelta = (newPosition.lat - startPosition.lat()) / numSteps;
    const lngDelta = (newPosition.lng - startPosition.lng()) / numSteps;

    let stepCount = 0;
    const interval = setInterval(() => {
      stepCount++;
      const nextPosition = {
        lat: startPosition.lat() + latDelta * stepCount,
        lng: startPosition.lng() + lngDelta * stepCount,
      };

      marker.setPosition(nextPosition);
      map.setCenter(nextPosition);

      if (stepCount >= numSteps) {
        clearInterval(interval);
      }
    }, timePerStep);
  };

  // Draw the route (polyline) on the map
  const drawRoute = (map, path) => {
    new window.google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2,
    }).setMap(map);
  };

  return (
    <div className="relative h-screen">
      <div id="map" className="h-full w-full" />
      <div className="absolute top-4 left-4 bg-white bg-opacity-90 p-4 h-[140px] max-h-[140px] rounded-lg shadow-md z-10  max-w-xs w-[250px] flex flex-col ">
      <h2 className="text-xl font-semibold mb-2">Vehicle Tracker</h2>
      <p className="text-gray-700">Current Position:</p>
     <p className="text-gray-600">Lat: {currentPosition.lat}, Lng: {currentPosition.lng}</p>
  {/* Loading indicator */}
  {loading && (
    <div className="flex items-center mt-2 h-8"> {/* Set a fixed height for the loading container */}
      <svg
        className="animate-spin h-5 w-5 text-blue-500 mr-2"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12c0 4.418 3.582 8 8 8s8-3.582 8-8H4z"/>
      </svg>
      <span>Loading...</span>
    </div>
  )}
</div>


    </div>
  );
};

export default Map;
