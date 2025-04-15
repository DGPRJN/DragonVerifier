"use client";
import {Container, Typography, Button} from "@mui/material";
import React, { useState } from "react";
//Deprecated

const Header = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
    return (
    <>
      <Container maxWidth="lg" sx={{ bgcolor: "lightgray", px: 4, pt: 1 }}>
      <Button onClick={toggleDrawer(true)}>Open Menu</Button>
        <Typography variant="body1" sx={{ textAlign: "center" }}>
          Random info idk man
        </Typography>
      </Container>
    </>
  );
};

export default Header;