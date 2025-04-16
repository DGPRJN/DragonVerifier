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
Dragon Verifier is an application that makes taking attendance for college classes easier for students and professors. The software will be able to take attendance for a class by allowing students to "check-in" to a class using their mobile device. It automatically connects to the Canvas API to update the gradebook with the attendance information, streamlining the attendance process. Professors can configure attendance settings for each class to suite their needs. One of these options is geolocation, which will verify a students is physically present before verifying attendance. With Dragon Verifier, we hope to develop a tool that is more secure and streamlined than traditional attendance-taking practices.
        </Typography>

      </Container>
    </div>
  );
}

export default Page