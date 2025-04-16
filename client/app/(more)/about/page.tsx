import { Box, Typography, Container } from "@mui/material";
import React from 'react'

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
          Dragon Verifier
        </Typography>
        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            marginBottom: 4, 
            color: "black",
          }}>
Dragon Verifier is a software solution designed to simplify and modernize attendance tracking for college classes. The application enables students to conveniently check in to class using their mobile devices, while seamlessly integrating with the Canvas API to automatically update attendance records in the gradebook. Professors can customize attendance settings for each course, including features such as geolocation verification to ensure students are physically present before confirming their attendance. With Dragon Verifier, our goal is to provide a secure, efficient, and user-friendly alternative to traditional attendance methods.
        </Typography>
      </Container>
    </div>
  );
}

export default Page