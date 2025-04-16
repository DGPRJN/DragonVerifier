import React from 'react'
import { Box, Typography, Container } from "@mui/material";

const Page = () =>{
  return(
    <div>
      <Container maxWidth="lg" sx={{ mt: 4}}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 4, 
            color: "black", 
          }}>
          Contact Us
        </Typography>
        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            marginBottom: 4, 
            color: "black",
          }}>
          Please wait until we have an email.
        </Typography>
      </Container>
    </div>
  );
}

export default Page