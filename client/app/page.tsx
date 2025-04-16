"use client";

import { CheckinButton } from './checkin';
import { Box, Typography, Container } from "@mui/material";

const Page = () => {
  return (
    <Container maxWidth="sm" sx={{ mt: 4, px: 2 }}> {/* maxWidth set to "sm" for mobile */}
      {/* Big bold text for "Checking in" */}
      <Typography
        variant="h4" // Reduced variant for smaller screens
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 2,
          color: "black",
          fontSize: { xs: '1.5rem', md: '2rem' }, // Responsive font size
        }}
      >
        Checking in
      </Typography>

      {/* Class name in smaller regular text */}
      <Typography
        variant="body2" // Smaller variant for mobile
        sx={{
          textAlign: "center",
          marginBottom: 3,
          color: "black",
        }}
      >
        SP2025 CS 499-1C/499L-Q21 CSA 4990qC/499L-Q2/499L-Q21 Senior BS/BSA Capstone
      </Typography>

      {/* Check-in button with padding */}
      <Box
        display="flex"
        justifyContent="center"
        sx={{
          textAlign: "center",
            fontSize: {
              xs: "1.5rem",  // mobile
              sm: "2rem",    // tablets
              md: "2.5rem",  // small desktops
              lg: "3rem",    // large screens
            },
          marginBottom: 2,
          px: 3, // Adds padding inside the container
          width: '100%', // Ensures consistent width for the container
        }}
      >
        <CheckinButton />
      </Box>

      {/* Smaller bold text for location access message */}
      <Typography
        variant="caption" // Adjusted for mobile
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          color: "black",
        }}
      >
        Ensure you are in the correct classroom for your current session. Location access will be required.
      </Typography>
    </Container>
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
