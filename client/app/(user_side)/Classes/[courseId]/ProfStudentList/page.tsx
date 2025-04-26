// import { useEffect } from "react";



// useEffect(() => {

//     const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
//     // Check if the user is an instructor
//     const checkRole = async () => {
//         try {
//         const roleResponse = await fetch(`${API_BASE_URL}/api/v1/oauth/whoami`, {
//             credentials: "include",
//         });

//         if (roleResponse.ok) {
//             const roleData = await roleResponse.json();
//             if (roleData.role === "Instructor") {
//             setIsInstructor(true);
//             } else {
//             setIsInstructor(false);
//             }
//         }
//         } catch (err) {
//         console.error("Failed to fetch user role", err);
//         window.location.href = `/`;
//         }
//     }; checkRole();
// });