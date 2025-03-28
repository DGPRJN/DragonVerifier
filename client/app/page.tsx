//TODO Get rid of this, we should try to do as much rendering on the server as possible
"use client";
import {Box, Button, Typography, Container} from "@mui/material";

const CheckinButton = () => {
  const handleClick = () => {
    console.log("Login button clicked");
  }
    return(
      <Button variant="contained" color="primary" onClick={handleClick}>Check-in</Button>
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
