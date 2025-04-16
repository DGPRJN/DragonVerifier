"use client";

import { CheckinButton, qrcvalidation } from './checkin';
import { Box, Typography, Container } from "@mui/material";

const Page = () => {
  const { isValid, isMounted } = qrcvalidation();

  if (!isMounted) return null;
  
  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4}}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 4, 
            color: "black", 
          }}>
          Checking in
        </Typography>
        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            marginBottom: 4, 
            color: "black",
          }}>
          SP2025 CS 499-1C/499L-Q21 CSA 4990qC/499L-Q2/499L-Q21 Senior BS/BSA Capstone
        </Typography>
        <Box display="flex" justifyContent="center" sx={{ marginBottom: 4 }}>
          <Display isValid={isValid} />
        </Box>
        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            color: "black",
          }}
        >
          Ensure you are in the correct classroom for your current session. Location access will be required.
        </Typography>
      </Container>
    </>
  );
};

export const Display = ({ isValid }: { isValid: boolean }) => {
  return (
    <Container maxWidth="lg" sx={{ bgcolor: "white", pt: 4}}>
      {isValid ? (
        <>
        <Box display="flex" justifyContent="center">
          <CheckinButton />
        </Box>
        </>
      ) : (
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            color: "Red",
            fontWeight: "bold",
            fontSize: "1.00rem",
            maxWidth: "80%",
            margin: "20px auto",
          }}
        >
          QR code or Link has expired or is invalid. Please scan a valid QR code or visit a valid Link.
        </Typography>
      )}
    </Container>
  );
};

export default Page;