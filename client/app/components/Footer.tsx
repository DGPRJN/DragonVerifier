import {Container, Typography} from "@mui/material";

function Footer() {
    return (
    <>
      <Container maxWidth="lg" sx={{ bgcolor: "lightgray", px: 4, pt: 1 }}>
        <Typography variant="body1" sx={{ textAlign: "center" }}>
          Random info idk man
        </Typography>
      </Container>
    </>
  );
}

export default Footer;
