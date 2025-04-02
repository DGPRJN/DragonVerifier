//Need to move this to (user_side)
//Need to try to get rid of "use client"
"use client";
import { Button, Container } from "@mui/material";
import React from 'react';
import login from './login.tsx'

//TODO Hook up Canvas API
//Should be the log-in flow
//Please Don't add any more non-UI code, add what you need to login.tsx
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
  return <LoginButton />;
};

export default Page;
