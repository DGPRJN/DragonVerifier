import React, { useState } from 'react'
import {Button} from "@mui/material";

export const CheckinButton = () => {
  const [location, setLocation] = useState<string | null>(null);
  
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setLocation(`Latitude: ${lat}, Longitude: ${lon}`);
          alert('Success!');
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
      {location && <p>{location}</p>}
    </div>
  );
};

export default CheckinButton;
