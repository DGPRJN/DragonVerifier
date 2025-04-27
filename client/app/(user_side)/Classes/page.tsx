"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
    Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, Button, IconButton, Box, Dialog, DialogTitle, DialogContent 
} from "@mui/material";
import Course_Settings from "@/app/components/Course_Settings";

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
  const [open, setOpen] = useState(false);
  const [isInstructor, setIsInstructor] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const router = useRouter();

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
    
    const fetchUserRole = async () => {
        try {
        const res = await fetch(`${API_BASE_URL}/api/v1/oauth/whoami`, {
            credentials: "include",
        });
        if (res.ok) {
            const data = await res.json();
            if (data.role === "Instructor") {
            setIsInstructor(true);
            } else {
            setIsInstructor(false);
            }
        } else {
            console.error("Failed to fetch user role");
        }
        } catch (err) {
        console.error("Error fetching user role:", err);
        }
    };
    
    fetchUserRole();
    fetchCourses();
  }, []);

  const handleCourseClick = (courseId: string) => {
    if (isInstructor) {
        router.push(`/Classes/${courseId}/ProfStudentList`);
    } else {
        router.push(`/Classes/${courseId}/StudentPage`);
    }
  };

  return (
    <div>
      {courses.length === 0 ? (
        <>
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
                  <TableCell
                    sx={{
                      backgroundColor: "#325E4B",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    Class Name
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "#325E4B",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    Instructor
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "#325E4B",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    Days
                  </TableCell>
                  {isInstructor && (
                    <TableCell
                        sx={{
                        backgroundColor: "#325E4B",
                        color: "white",
                        fontWeight: "bold",
                        }}
                    >
                        Settings
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.map((course) => (
                  <TableRow
                    key={course.id}
                    sx={{
                      transition: "background 0.3s",
                      "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                      "&:active": { backgroundColor: "rgba(33, 150, 243, 0.3)" },
                    }}
                  >
                    <TableCell>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCourseClick(course.id);
                        }}
                        sx={{ color: "black", textTransform: "none" }}
                      >
                        {course.name}
                      </Button>
                    </TableCell>
                    <TableCell>{course.instructor.name || "Unknown"}</TableCell>
                    <TableCell>{course.schedule?.days || "N/A"}</TableCell>

                    {isInstructor && (
                        <> 
                            <TableCell>
                                <IconButton
                                    onClick={(e) => {
                                    e.stopPropagation();
                                    console.log(`Settings for course ${course.id}`);
                                    setSelectedCourseId(course.id);
                                    setOpen(true);
                                    }}
                                    aria-label={`settings-${course.id}`}
                                >
                                    Settings
                                </IconButton>
                            </TableCell>

                            {selectedCourseId === course.id && (
                            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
                                <DialogTitle>Settings</DialogTitle>
                                <DialogContent>
                                <Course_Settings open={open} onClose={() => setOpen(false)} courseId={course.id} />
                                </DialogContent>
                            </Dialog>
                            )} 
                        </>
                    )}
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
