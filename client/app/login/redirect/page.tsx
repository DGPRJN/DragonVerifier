"use client";

import { useAuth } from "@/app/hooks/auth-provider";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Typography,
} from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const rootApi = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`;
const API_BASE_URL = `${process.env.NEXT_PUBLIC_FRONTEND_URL}`;

export default function Page() {
    const queryParams = useSearchParams();
    const router = useRouter();
    const auth = useAuth();

    const success = queryParams.get("success");
    const error = queryParams.get("message");

    // TODO: here we will look for "redirect to" query

    setTimeout(() => {
        window.location.href = `${API_BASE_URL}`;
    }, 1000);

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
                <Typography>Redirecting you to Check-in...</Typography>
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
