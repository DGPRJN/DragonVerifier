"use client";

import { useRef, useState, useEffect } from "react";
import { Button, Container, Box, Typography, RadioGroup, FormControlLabel, Radio, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import generate from "./generate";
import router from "next/router";

interface Course {
  id: string;
  name: string;
}

const GenerateQRCode = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [expired, setExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [selectedType, setSelectedType] = useState<"qr" | "link">("qr");
  const [generatedLink, setGeneratedLink] = useState<string | null>(""); 
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(""); 
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const loginUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/courses`, {
        credentials: "include",
      });
      if (response.ok) {
        const data: Course[] = await response.json();
        setCourses(data);
      } else {
        console.error("No courses found for this user");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

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
        } else {
          fetchCourses();
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
    if (!selectedCourse) {
      alert("Please select a course.");
      return;
    }

    setExpired(false);
    setQrGenerated(true);
    setGeneratedLink(null);

    if (timerRef.current) clearInterval(timerRef.current);

    const { expireTime, qrCodeUrl } = await generate(
      selectedType === "qr" ? canvasRef.current : null,
      `${loginUrl}`,
      selectedCourse
    );

    if (selectedType === "link" && qrCodeUrl) {
      setGeneratedLink(qrCodeUrl);
    }

    if (expireTime !== null) {
      setTimeLeft(expireTime / 10000);

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null) return null;
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setExpired(true);
    }
  };

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
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Course</InputLabel>
        <Select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          label="Course"
        >
          {courses.map((course) => (
            <MenuItem key={course.id} value={course.id}>
              {course.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

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
        <Typography mt={2} variant="body2" color="white" sx={{ fontSize: "1.2rem" }}>
          Generated Link: <a href={generatedLink} style={{ color: "green" }} target="_blank">{generatedLink}</a>
        </Typography>
      )}

      {timeLeft !== null && !expired && (
        <Typography variant="body2" color="black" mt={1} sx={{ fontSize: "1.2rem" }}>
          {selectedType === "qr" ? "QR Code" : "Link"} expires in: {timeLeft} second{timeLeft !== 1 ? "s" : ""}
        </Typography>
      )}

      {expired && (
        <Typography variant="body2" color="error" mt={1} sx={{ fontSize: "1.2rem" }}>
          {selectedType === "qr" ? "QR Code" : "Link"} has expired. Please generate a new one.
        </Typography>
      )}
    </Container>
  );
};

export default GenerateQRCode;
