"use client"; 

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; 

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
}

const CourseDetails = () => {
  const [course, setCourse] = useState<Course | null>(null);
  const params = useParams();
  const courseId = params?.courseId as string;

  useEffect(() => {
    if (!courseId) return;
    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const fetchCourse = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/courses/${courseId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", 
        }); // Fetch specific course using courseId
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

    fetchCourse();
  }, [courseId]);

  // Helper function to format schedule
  const formatSchedule = (schedule: { days: string; startTime: string; endTime: string } | undefined) => {
    if (!schedule || !schedule.days || !schedule.startTime || !schedule.endTime) {
      return "TBA";
    }
    console.log("Schedule object:", schedule);
    return `${schedule.days} | ${schedule.startTime} - ${schedule.endTime}`;
  };
  
  if (!course) return <p>Loading...</p>;
  
  return (
    <div>
      <h1>Course Details</h1>
      <p><strong>Course:</strong> {course.name}</p>
      <p><strong>Instructor:</strong> {course.instructor?.name || "Unknown"}</p>
      <p><strong>Schedule:</strong> {formatSchedule(course.schedule)}</p>
    </div>
  );
};

export default CourseDetails;