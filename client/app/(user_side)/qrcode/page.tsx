"use client";

import { useRef, useState, useEffect } from "react";
import { Button, Container, Box, Typography, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import generate from "./generate";

const GenerateQRCode = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [expired, setExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [selectedType, setSelectedType] = useState<"qr" | "link">("qr");
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const loginUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;

  const handleClick = async () => {
    setExpired(false);
    setTimeLeft(60);
    setQrGenerated(true);
    setGeneratedLink(null);

    if (timerRef.current) clearInterval(timerRef.current);

    const link = await generate(
      selectedType === "qr" ? canvasRef.current : null,
      `${loginUrl}`
    );

    if (selectedType === "link" && link) {
      setGeneratedLink(link);
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Clears timer when state is changed
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setTimeLeft(null);
    setExpired(false);
    setQrGenerated(false);
    setGeneratedLink(null);
  }, [selectedType]);
  

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingY: 4,
        gap: 2,
      }}
    >
      <RadioGroup
        row
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value as "qr" | "link")}
      >
        <FormControlLabel value="qr" control={<Radio />} label="QR Code" />
        <FormControlLabel value="link" control={<Radio />} label="Link" />
      </RadioGroup>

      <Button variant="contained" color="primary" onClick={handleClick}>
        Generate {selectedType === "qr" ? "QR Code" : "Link"}
      </Button>

      {selectedType === "qr" && (
        <Box mt={2}>
          <canvas ref={canvasRef} />
        </Box>
      )}

      {selectedType === "link" && generatedLink && (
        <Typography mt={2} variant="body2" color="white" sx={{ fontSize: "1.2rem"}}>
          Generated Link: <a href={generatedLink} style={{ color: "green" }} target="_blank">{generatedLink}</a>
        </Typography>
      )}

      {timeLeft !== null && !expired && (
        <Typography variant="body2" color="black" mt={1} sx={{ fontSize: "1.2rem"}}>
          {selectedType === "qr" ? "QR Code" : "Link"} expires in: {timeLeft} second{timeLeft !== 1 ? "s" : ""}
        </Typography>
      )}

      {expired && (
        <Typography variant="body2" color="error" mt={1} sx={{ fontSize: "1.2rem"}}>
          {selectedType === "qr" ? "QR Code" : "Link"} has expired. Please generate a new one.
        </Typography>
      )}
    </Container>
  );
};

const Page = () => {
  return <GenerateQRCode />;
};

export default Page;
