"use client";

import React, { useEffect, useState } from "react";
import {
  Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Box, Button, Dialog, DialogTitle,
  DialogContent
} from "@mui/material";
import { useParams } from "next/navigation";
import Course_Settings from "@/app/components/Course_Settings";

interface AttendanceRecord {
  canvasUserId: string;
  canvasId: string;
  status: "Present" | "Absent" | "Late" | "Pending";
  timestamp: string;
  createdAt: string;
}

interface Course {
  id: string;
  canvasId: string;
  name: string;
  schedule: {
    days: string;
    startTime: string;
    endTime: string;
  };
  instructor: {
    id: string;
    name: string;
  };
  attendance: AttendanceRecord[];
  datesArray: string[];
}

interface User {
  id: string;
  role: "Student" | "Instructor";
}

const CourseDetails = () => {
  const [course, setCourse] = useState<Course | null>(null);
  const [user, setUser] = useState<User | null>(null); // Add user state
  const [open, setOpen] = useState(false);
  const params = useParams();
  const courseId = params?.courseId as string;

  useEffect(() => {
    if (!courseId) return;
    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/v1/courses/${courseId}`, {
          credentials: "include",
        });
        if (response.ok) {
          const data: Course = await response.json();
          setCourse(data);
        } else {
          console.error("Course not found");
        }
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };

    const fetchUser = async () => {
      try {
        const response = await fetch("/api/v1/user", {
          credentials: "include", // Adjust endpoint if needed
        });
        if (response.ok) {
          const data: User = await response.json();
          setUser(data);
        } else {
          console.error("User not found");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchCourse();
    fetchUser();
  }, [courseId]);

  const formatSchedule = (schedule: { days: string; startTime: string; endTime: string } | undefined) => {
    if (!schedule || !schedule.days || !schedule.startTime || !schedule.endTime) {
      return "TBA";
    }
    return `${schedule.days} | ${schedule.startTime} - ${schedule.endTime}`;
  };

  const getAttendanceStatus = (date: string) => {
    const attendanceRecord = course?.attendance.find(
      (record) => record.timestamp.startsWith(date)
    );
    return attendanceRecord ? attendanceRecord.status : "Pending";
  };

  if (!course || !user) return <p>Loading...</p>;

  return (
    <>
      <Typography variant="h4" sx={{ color: "black", pt: 1, pb: 1, pl: 1 }}>
        {course.name}
      </Typography>
      <Typography variant="h5" sx={{ color: "black", pt: 1, pb: 1, pl: 1 }}>
        Instructor: {course.instructor.name}
      </Typography>
      <Typography variant="h5" sx={{ color: "black", pt: 1, pb: 1, pl: 1 }}>
        Class Time: {formatSchedule(course.schedule)}
      </Typography>

      {user.role === "Instructor" && (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
            Open Settings
          </Button>
        </Box>
      )}

      {user.role === "Instructor" && (
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Settings</DialogTitle>
          <DialogContent>
            <Course_Settings open={open} onClose={() => setOpen(false)} courseId={courseId} />
          </DialogContent>
        </Dialog>
      )}

      {user.role === "Student" && (
        <TableContainer component={Paper} sx={{ pl: 1, pr: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ backgroundColor: "#325E4B", color: "white", fontWeight: "bold" }}>Date</TableCell>
                <TableCell style={{ backgroundColor: "#325E4B", color: "white", fontWeight: "bold" }}>Attendance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {course.datesArray.map((day, index) => {
                const status = getAttendanceStatus(day);
                let statusColor = "limegreen";
                if (status === "Absent") statusColor = "#ef5350";
                else if (status === "Late") statusColor = "yellow";
                else if (status === "Pending") statusColor = "lightgrey";
                const formattedDate = new Date(day).toLocaleDateString();

                return (
                  <TableRow key={index} sx={{ pl: 1, pr: 1 }}>
                    <TableCell>{formattedDate}</TableCell>
                    <TableCell sx={{ backgroundColor: statusColor }}>
                      {status}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default CourseDetails;
