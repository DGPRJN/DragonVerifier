"use client";
import { CheckinButton, qrcvalidation } from './checkin';
import { Typography, Container } from "@mui/material";

const Page = () => {
  const { isValid } = qrcvalidation();

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
          <CheckinButton/>
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
          QR code or Link has expired or is invalid. Please scan a valid one.
        </Typography>
      )}
    </Container>
  );
};

export default Page;
