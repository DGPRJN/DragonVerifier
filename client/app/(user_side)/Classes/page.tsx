"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton } from "@mui/material";

interface Course {
  id: string;
  canvasId: string;
  name: string;
  instructorId: string;
  instructor: {
    id: string;
    name: string;
  };
  schedule: any;
  createdAt: string;
}

const Page = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const router = useRouter(); // Initialize router

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  
  useEffect(() => {
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

    fetchCourses();
  }, []);

  // Function to navigate to the selected course page
  const handleCourseClick = (courseId: string) => {
    router.push(`/Classes/${courseId}`); // Navigate to dynamic course page
  };

  // Placeholder Function for the Course TableRow
  function doNothing() {
    return;
  }

  return (
    <div>
      {courses.length === 0 ? (
        <>
          {/* No courses found, show sample table */}
          <Typography sx={{ color: "black", pt: 1, pb: 1, pl: 1 }}>
            No courses found.
          </Typography>
        </>
      ) : (
        <>
        <Typography sx={{ color: "black", pt: 1, pb: 1, pl: 1 }}>
          Your Courses:
        </Typography>
        <TableContainer component={Paper} sx={{ pl: 1, pr: 1 }}>
          <Table>
          <TableHead>
  <TableRow>
    <TableCell sx={{ backgroundColor: "#325E4B", color: "white", fontWeight: "bold" }}>
      Class Name
    </TableCell>
    <TableCell sx={{ backgroundColor: "#325E4B", color: "white", fontWeight: "bold" }}>
      Instructor
    </TableCell>
    <TableCell sx={{ backgroundColor: "#325E4B", color: "white", fontWeight: "bold" }}>
      Days
    </TableCell>
  </TableRow>
</TableHead>
<TableBody>
  {courses.map((course) => (
    <TableRow
      key={course.id}
      onClick={() => handleCourseClick(course.id)}
      sx={{
        cursor: "pointer",
        transition: "background 0.3s",
        "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
        "&:active": { backgroundColor: "rgba(33, 150, 243, 0.3)" },
      }}
    >
      <TableCell>{course.name}</TableCell>
      <TableCell>{course.instructor.name || "Unknown"}</TableCell>
      <TableCell>{course.schedule?.days || "N/A"}</TableCell>
      <TableCell>
        <IconButton
          onClick={(e) => {
            e.stopPropagation(); // Prevent row click
            console.log(`Settings for course ${course.id}`);
          }}
          aria-label={`settings-${course.id}`}
        >
          settings
        </IconButton>
        </TableCell>
    </TableRow>
  ))}
</TableBody>
          </Table>
        </TableContainer>
      </>
      )}
    </div>
  );
};

export default Page;