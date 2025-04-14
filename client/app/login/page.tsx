//Need to move this to (user_side)
//Need to try to get rid of "use client"

"use client";
import { Button, Container, Typography } from "@mui/material";

//TODO Hook up Canvas API
// Login oauth/login
//Should be the log-in flow
//Please Don't add any more non-UI code, add what you need to login.tsx


// Function to check QR code validity
// Page.tsx

import { qrcvalidation } from './login.tsx';

export const Account = ({ isValid }: { isValid: boolean }) => {
  return (
    <Container maxWidth="lg" sx={{ bgcolor: "gray", padding: 4 }}>
      {isValid ? (
        <>
          <Typography variant="h4" sx={{ textAlign: "center" }}>
            Dragon Verifier (User Side)
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "center" }}>
            Click here to login to Canvas
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

const LoginButton = () => {
  const handleClick = () => {
    console.log("Login Button Clicked");
  };

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Button variant="contained" color="primary" onClick={handleClick}>
        Login
      </Button>
    </Container>
  );
};

const Page = () => {
  const { isValid, isMounted } = qrcvalidation();

  if (!isMounted) return null;

  return (
    <>
      <Account isValid={isValid} />
      {isValid && <LoginButton />}
    </>
  );
};

export default Page;
