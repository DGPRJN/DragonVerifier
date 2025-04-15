"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Course {
    id: string;
    canvasId: string;
    instructorId: string;
    schedule: any;
    createdAt: string;
}

const Page = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const router = useRouter(); // Initialize router

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch("/api/courses");
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
            <h1>Courses</h1>
            <ul>
                {courses.length === 0 ? (
                    <li>No courses found</li>
                ) : (
                    courses.map((course) => (
                        <li
                            key={course.id}
                            onClick={() => handleCourseClick(course.id)} // Handle click event
                            style={{
                                cursor: "pointer",
                                color: "blue",
                                textDecoration: "underline",
                            }}
                        >
                            {course.canvasId}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default Page;
