"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

interface Course {
  id: string;
  canvasId: string;
  name: string;
  instructorId: string;
  schedule: any;
  createdAt: string;
}

const Page = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const router = useRouter(); // Initialize router

  // Sample table data for class records (displayed when no courses are found)
  const classData = [
    {
      className: "SP2025 CS 499-1C/499L-Q21 CSA 4990qC/499L-Q2/499L-Q21 Senior BS/BSA Capstone",
      instructor: "Amber Wagner",
      meetingTime: "MWF 10:10-11:00",
      attendanceRecord: "21/25",
      attendancePercentage: "84%", // Derived percentage
    },
    {
      className: "SP2025 MA 227-6D Calculus III",
      instructor: "Marius Nkashama",
      meetingTime: "MW 2:30-4:20",
      attendanceRecord: "18/20",
      attendancePercentage: "90%", // Derived percentage
    },
    {
      className: "SP2025 MA 360/560 Scientific Programming",
      instructor: "Carmeliza Navasca",
      meetingTime: "TH 9:30-10:45",
      attendanceRecord: "20/24",
      attendancePercentage: "83%", // Derived percentage
    },
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/v1/courses");
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

  return (
    <div>
      {courses.length === 0 ? (
        <>
          {/* No courses found, show sample table */}
          <Typography sx={{ color: "black", pt: 1, pb: 1, pl: 1 }}>
            No courses found. Displaying sample class records below:
          </Typography>
          <TableContainer component={Paper} sx={{ pl: 1, pr: 1 }}>
            <Table>
              {/* Table Header */}
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{
                      backgroundColor: "#325E4B", // Green header background
                      color: "white", // White text for better readability
                      fontWeight: "bold",
                    }}
                  >
                    Class Name
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: "#325E4B",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    Instructor
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: "#325E4B",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    Meeting Time
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: "#325E4B",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    Attendance Record
                  </TableCell>
                </TableRow>
              </TableHead>
              {/* Table Body */}
              <TableBody>
                {classData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.className}</TableCell>
                    <TableCell>{item.instructor}</TableCell>
                    <TableCell>{item.meetingTime}</TableCell>
                    <TableCell>
                      {item.attendanceRecord} ({item.attendancePercentage})
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <ul>
          {/* Render fetched courses */}
          {courses.map((course) => (
            <li
              key={course.id}
              onClick={() => handleCourseClick(course.id)} // Handle click event
              style={{
                cursor: "pointer",
                color: "blue",
                textDecoration: "underline",
              }}
            >
              {course.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Page;