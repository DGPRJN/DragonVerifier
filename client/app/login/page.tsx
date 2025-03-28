"use client";
import { Button, Container, Typography } from "@mui/material";
import React from 'react';
import login from './login.tsx'

//TODO Hook up Canvas API
// Login oauth/login
//Should be the log-in flow

export const Account = () => {
  return (
    <Container maxWidth="lg" sx={{ bgcolor: "gray", padding: 4 }}>
      <Typography variant="h4" sx={{ textAlign: "center" }}>
        Dragon Verifier (User Side)
      </Typography>
      <Typography variant="body1" sx={{ textAlign: "center" }}>
        Click here to login to Canvas
      </Typography>
      </Container>
  );
}

const LoginButton = () => {
  const handleClick = () => {
    login();
  };

  return (
    <Container
      sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
    >
      <Button variant="contained" color="primary" onClick={handleClick}>
        Login
      </Button>
    </Container>
  );
};

const Page = () => {
  return (
    <>
      <Account />
      <LoginButton />
    </>
  );
};

export default Page;
