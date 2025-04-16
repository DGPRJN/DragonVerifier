"use client";

import { CheckinButton } from './checkin';
import { Box, Typography, Container } from "@mui/material";

const Page = () => {
  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 4, 
            color: "black", 
          }}
        >
          Checking in
        </Typography>

        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            marginBottom: 4, 
            color: "black",
          }}
        >
          SP2025 CS 499-1C/499L-Q21 CSA 4990qC/499L-Q2/499L-Q21 Senior BS/BSA Capstone
        </Typography>

        <Box display="flex" justifyContent="center" sx={{ marginBottom: 4 }}>
          <CheckinButton />
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
    <Container maxWidth="lg" sx={{ bgcolor: "gray", padding: 4 }}>
      {isValid ? (
        <>
          <Typography variant="h4" sx={{ textAlign: "center" }}>
            Dragon Verifier (Student View)
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "center" }}>
            Click here to Check in
          </Typography>
        </>
      ) : (
        <Typography
          variant="h6"
          color="error"
          sx={{
            textAlign: "center",
            backgroundColor: "Green",
            color: "White",
            padding: 2,
            borderRadius: 2,
            boxShadow: 2,
            fontWeight: "bold",
            fontSize: "1.25rem",
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
