"use client";

import { useAuth } from "@/app/hooks/auth-provider";
import {
    Alert,
    Box,
    Typography,
} from "@mui/material";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}`;

export default function Page() {
    const queryParams = useSearchParams();
    const router = useRouter();
    const auth = useAuth();

    const success = queryParams.get("success");
    const error = queryParams.get("message");

    // TODO: here we will look for "redirect to" query


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/oauth/whoami`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });
    
                const data = await response.json();
    
                if (data.success) {
                    if (data.role === "Instructor") {
                        router.push("/Classes");
                    } else {
                        router.push("/");
                    }
                } else {
                    console.error("Failed to fetch user data:", data);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
    
        fetchUser();
    }, []);
    

    if (success == "true") {
        useEffect(() => {
            auth.redirectAction();
        }, []);

        return (
            <Box
                display="flex"
                flexDirection="column"
                p="1em"
                gap="1em"
                alignItems="center"
            >
                <Alert severity="success">Successfully logged in!</Alert>
                <Typography>Redirecting...</Typography>
            </Box>
        );
    }

    return (
        <Box
            display="flex"
            flexDirection="column"
            p="1em"
            gap="1em"
            alignItems="center"
        >
            <Alert severity="error">
                {error ? "Error: " + error : "Something went wrong..."}
            </Alert>
            <Link href="/" style={{ textDecoration: "underline" }}>
                Go home.
            </Link>
        </Box>
    );
}
