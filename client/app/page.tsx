"use client"; // Ensures it runs on the client side

import { Button, Typography, Container} from "@mui/material";

export default function Home() {
  return (
    <Container maxWidth="sm">
      <Typography variant="h4">Dragon Verifier</Typography>
      <Button variant="contained" color="primary">
        Click Me
      </Button>
    </Container>
  );
}
