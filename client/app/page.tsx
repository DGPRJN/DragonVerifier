//TODO Get rid of this, we should try to do as much rendering on the server as possible
"use client";
import {CheckinButton} from './checkin'
import Header from './components/Header.tsx'
import {Box, Typography, Container} from "@mui/material";


export default function Home() {
  return (
    <>
      <Header/>
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




  