
import {Typography, Container} from "@mui/material";

export default function Home() {
  return (
    <>
      <Container maxWidth="lg" sx={{ bgcolor: "gray", padding: 4 }}>
        <Typography variant="h4" sx={{ textAlign: "center" }}>Dragon Verifier (Home Page)</Typography>
        <Typography variant="Body" sx={{ textAlign: "center" }}></Typography>
      </Container>
    </>
  );
}
