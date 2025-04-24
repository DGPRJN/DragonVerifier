"use client";

import { useRef, useState, useEffect } from "react";
import { Button, Container, Box, Typography, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import generate from "./generate";
import router from "next/router";

const GenerateQRCode = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [expired, setExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [selectedType, setSelectedType] = useState<"qr" | "link">("qr");
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const loginUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  
  useEffect(() => {
    const checkRole = async () => {
      
      try {
        const roleResponse = await fetch(`${API_BASE_URL}/api/v1/oauth/whoami`, {
          credentials: "include",
        });

        if (!roleResponse.ok) {
          throw new Error("Failed to fetch user role");
        }

        const roleData = await roleResponse.json();
        if (roleData.role !== "Instructor") {
            setTimeout(() => {
                window.location.href = `/`;
            });
        }
      } catch (err) {
        console.error("Failed to fetch user role", err);
        setTimeout(() => {
            window.location.href = `/`;
        });
      }
    };

    checkRole();
  }, [router]);
  
  const handleClick = async () => {
    setExpired(false);
    setTimeLeft(300);
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
        <FormControlLabel
          value="qr"
          control={<Radio />}
          label="QR Code"
          sx={{ color: "black" }}
        />
        <FormControlLabel
          value="link"
          control={<Radio />}
          label="Link"
          sx={{ color: "black" }}
        />
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
