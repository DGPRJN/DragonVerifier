"use client";

import teamLogo from './Dragon_Verifier.png';
import { Container, Typography, Box, Grid } from "@mui/material";

const contacts = [
  { name: "Reid Cato", email: "rjcato@uab.edu" },
  { name: "Joe McElderry", email: "jwmcelde@uab.edu" },
  { name: "Nicholas Fason", email: "nfason@uab.edu" },
  { name: "Patrick Landry", email: "pjlandry@uab.edu" },
  { name: "Grant Mitchell", email: "grantm24@uab.edu" },
  { name: "Dawson Wright", email: "wrightdr@uab.edu" },
];

const Page = () => {
  return (
    <Container maxWidth="md" sx={{ textAlign: "center", mt: 6 }}>
      <Box sx={{ mb: 4 }}>
        <img
          src={teamLogo.src}
          alt="Team Logo"
          style={{
            maxWidth: "300px",
            width: "100%",
            margin: "0 auto",
            display: "block",
          }}
        />
      </Box>
      <Typography
        variant="h4"
        fontWeight="bold"
        color="primary"
        sx={{ mb: 4 }}
      >
        Contact Us
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {contacts.map((person, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, color: "Green" }}
            >
              {person.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#AC7D0C", fontSize: "0.9rem", mb: 2 }}
            >
              {person.email}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
};

export default Page;