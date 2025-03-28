"use client";
import { Button, Container } from "@mui/material";
import React from 'react';

//TODO Hook up Canvas API
const LoginButton = () => {
  const handleClick = () => {
    console.log("Login button clicked");
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
