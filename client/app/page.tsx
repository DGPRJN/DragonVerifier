//TODO Get rid of this, we should try to do as much rendering on the server as possible
"use client";
import {Box, Button, Typography, Container} from "@mui/material";
import React, { useState } from 'react'

const CheckinButton = () => {
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

export default function Home() {
  return (
    <>
      <Container maxWidth="lg" sx={{ bgcolor: "gray", padding: 4 }}>
        <Typography variant="h4" sx={{ textAlign: "center" }}>Dragon Verifier (User Side)</Typography>
        <Typography variant="Body" sx={{ textAlign: "center" }}>I think here we should have a general check-in button that detects the class and makes a record (if applicable, for example if the class takes a qr code this should be grayed out)</Typography>
        <Box display="flex" justifyContent="center">
        <CheckinButton/>
        </Box>
      </Container>
    </>
  );
}




  