import React, { useState } from 'react'
import {Button} from "@mui/material";

export const CheckinButton = () => {
  const [location, setLocation] = useState<string | null>(null);
  const [isInside, setIsInside] = useState<boolean | null>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  console.log("API Base URL:", API_BASE_URL);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude.toFixed(17);
          const lon = position.coords.longitude.toFixed(17);
          setLocation(`Latitude: ${lat}, Longitude: ${lon}`);

          const response = await fetch(`${API_BASE_URL}/api/check-location`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ latitude: lat, longitude: lon }),
          });
          
          const data = await response.json();
          setIsInside(data.insideGeofence);
        },
        (error) => {
          alert('Error getting location: ' + error.message);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };


  return(
    <div>
      <Button variant="contained" color="primary" onClick={getLocation}>Check-in</Button>
      {isInside !== null && (
        <p>
          {isInside ? "Thank you for using Dragon Verifier. You are now checked in and may close this page" : "Check in failed. Please ensure you are inside the geofence before attempting to check in again"}
        </p>
      )}
    </div>
  );
};



