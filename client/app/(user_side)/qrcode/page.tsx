"use client";

import { useRef, useState, useEffect } from "react";
import { Button, Container, Box, Typography } from "@mui/material";
import generate from "./generate";

const GenerateQRCode = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [expired, setExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [qrGenerated, setQrGenerated] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const loginUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;

  const handleClick = () => {
    generate(canvasRef.current, `${loginUrl}`);
    setExpired(false);
    setTimeLeft(60);
    setQrGenerated(true);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setExpired(true);

          const ctx = canvasRef.current?.getContext("2d");
          if (ctx && canvasRef.current) {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          }

          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

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
      <Button variant="contained" color="primary" onClick={handleClick}>
        Generate QR Code
      </Button>

      <Box mt={2}>
        <canvas
          ref={canvasRef}
          style={{
            border: qrGenerated ? "1px solid #ccc" : "none",
            display: qrGenerated ? "block" : "none",
          }}
        />
      </Box>

      {timeLeft !== null && !expired && (
        <Typography variant="body2" color="error" mt={1}>
          QR Code expires in: {timeLeft} second{timeLeft !== 1 ? "s" : ""}
        </Typography>
      )}

      {expired && (
        <Typography variant="body2" color="error" mt={1}>
          QR Code has expired. Please generate a new one.
        </Typography>
      )}
    </Container>
  );
};

const Page = () => {
  return (
    <>
      <GenerateQRCode />
    </>
  );
};

export default Page;
