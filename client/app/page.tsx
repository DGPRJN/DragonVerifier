"use client";
import {CheckinButton} from './checkin'
import {Box, Typography, Container} from "@mui/material";
import Header from './components/Header.tsx'
import { qrcvalidation } from './checkin.tsx';


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

const Page = () => {
  const { isValid, isMounted } = qrcvalidation();

  if (!isMounted) return null;

  return (
    <>
      <Container maxWidth="lg" sx={{ bgcolor: "gray", padding: 4 }}>
        <Typography variant="h4" sx={{ textAlign: "center" }}>Dragon Verifier (User Side)</Typography>
        <Typography variant="Body" sx={{ textAlign: "center" }}>I think here we should have a general check-in button that detects the class and makes a record (if applicable, for example if the class takes a qr code this should be grayed out)</Typography>
        <Box display="flex" justifyContent="center" >
        <CheckinButton/>
        </Box>
      </Container>
      <Display isValid={isValid} />
      {isValid && <CheckinButton/>}
    </>
  );
};

export default Page;