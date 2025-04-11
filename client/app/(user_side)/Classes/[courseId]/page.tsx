"use client"; 

import React, { useEffect, useState } from "react";
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
  const [course, setCourse] = useState<Course | null>(null);
  const params = useParams();
  const courseId = params?.courseId as string;

  useEffect(() => {
    if (!courseId) return;

    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${courseId}`); // Fetch specific course using courseId
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
  const formatSchedule = (schedule: { days: string[]; time: string }) => {
    const days = schedule.days.join(", ");
    return `${days} | ${schedule.time}`;
  };

  if (!course) return <p>Loading...</p>;

  return (
    <div>
      <h1>Course Details</h1>
      <p><strong>Canvas ID:</strong> {course.canvasId}</p>
      <p><strong>Instructor:</strong> {course.instructor?.name || "Unknown"}</p>
      <p><strong>Schedule:</strong> {formatSchedule(course.schedule)}</p>
    </div>
  );
};

export default CourseDetails;