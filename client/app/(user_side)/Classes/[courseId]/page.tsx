"use client"; 

import React, { useEffect, useState } from "react";
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import { useParams } from "next/navigation"; 

interface Course {
  id: string;
  canvasId: string;
  schedule: {
    days: string[];
    time: string;
  };
  instructor: {
    id: string;
    name: string;
  };
}

const CourseDetails = () => {
  //const [course, setCourse] = useState<Course | null>(null);
  const params = useParams();
  const courseId = params?.courseId as string;

  // useEffect(() => {
  //   if (!courseId) return;

  //   const fetchCourse = async () => {
  //     try {
  //       const response = await fetch(`/api/courses/${courseId}`); // Fetch specific course using courseId
  //       if (response.ok) {
  //         const data: Course = await response.json();
  //         setCourse(data);
  //       } else {
  //         console.error("Course not found");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching course:", error);
  //     }
  //   };

  //   fetchCourse();
  // }, [courseId]);



  // Helper function to format schedule
  const formatSchedule = (schedule: { days: string[]; time: string }) => {
    const days = schedule.days.join(", ");
    return `${days} | ${schedule.time}`;
  };

  // if (!course) return <p>Loading...</p>;

  const course = {
    id: 'CS499-1C',
    name: "SP2025 CS 499-1C/499L-Q21 CSA 4990qC/499L-Q2/499L-Q21 Senior BS/BSA Capstone",
    canvasId: 'student1',
    schedule: {
      days: ['M','W','F'],
      time: '10:10a-11:00a',
    },
    instructor: {
      id: 'instructor',
      name: 'Amber Wagner',
    },
    attendance: {
      daysOfClass: [
        "01/01", "01/03", "01/06", "01/08", "01/10", "01/13", "01/15", "01/17",
        "01/22", "01/24", "01/27", "01/29", "01/31", "02/03", "02/05", "02/07",
        "02/10", "02/12", "02/14", "02/17", "02/19", "02/21", "02/24", "02/26",
        "02/28", "03/03", "03/05", "03/07", "03/10", "03/12", "03/14", "03/21",
        "03/24", "03/26", "03/28", "03/31", "04/02", "04/04", "04/07", "04/09",
        "04/11", "04/14", "04/16", "04/18"
      ],
      daysAbsent: ['2','5','15','24','30','35'],
      daysEdited: ['3','8','20','26','31','32'],
    }
  }

  return (
    <>
    <Typography variant='h4' sx={{ color: "black", pt: 1, pb: 1, pl: 1 }}>{course.name}</Typography>
    <Typography variant='h5' sx={{color: "black", pt:1, pb:1, pl:1}}>Instructor: {course.instructor.name}</Typography>
    <Typography variant='h5' sx={{color: "black", pt:1, pb:1, pl:1}}>Class Time: {course.schedule.days.join("")} {course.schedule.time}</Typography>
      <TableContainer component={ Paper } sx={ {pl:1, pr:1}}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  style={{
                    backgroundColor: "#325E4B", // Green header background
                    color: "white", // White text for better readability
                    fontWeight: "bold",
                  }}
                >
                  Day
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: "#325E4B", // Green header background
                    color: "white", // White text for better readability
                    fontWeight: "bold",
                  }}
                >
                  Attenance
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {course.attendance.daysOfClass.map( (day, index) => (
                <TableRow key={index} sx={{ pl:1, pr:1}}>
                  <TableCell>
                    {day}
                  </TableCell>
                  {course.attendance.daysAbsent.includes(index.toString()) ? (
                    <TableCell sx={{ backgroundColor: 'red' }}>
                      Absent
                    </TableCell>
                  ) : ( course.attendance.daysEdited.includes(index.toString()) ? (
                    <TableCell sx={{ backgroundColor: 'yellow' }}>
                      Tardy
                    </TableCell>
                  ) : (
                    <TableCell sx={{ backgroundColor: 'green' }}>
                      Present
                    </TableCell>
                  )
                    
                  )}
                </TableRow>
              ))}

            </TableBody>
          </Table>
      </TableContainer>
    </>
    // <div>
    //   <h1>Course Details</h1>
    //   <p><strong>Canvas ID:</strong> {course.canvasId}</p>
    //   <p><strong>Instructor:</strong> {course.instructor?.name || "Unknown"}</p>
    //   <p><strong>Schedule:</strong> {formatSchedule(course.schedule)}</p>
    // </div>
  );
};

export default CourseDetails;