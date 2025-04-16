"use client";
import {
    Button,
    Container,
    Typography,
    Box,
    CircularProgress,
    Alert,
} from "@mui/material";
import React, { useState } from "react";
import login from "./login.tsx";

const LoginButton = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const handleClick = () => {
        setLoading(true);
        const success = login();

        if (!success) {
            setLoading(false);
            setError(true);
        }
    };

    if (loading) return <CircularProgress />;

    return (
        <>
            {error ? (
                <Alert severity="error">Something went wrong...</Alert>
            ) : (
                ""
            )}
            <Button variant="contained" color="primary" onClick={handleClick}>
                Login with Canvas
            </Button>
        </>
    );
};

const Page = () => {
    return (
        <>
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                {/* Big bold text */}
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: "bold",
                        textAlign: "center",
                        marginBottom: 4,
                        color: "black",
                    }}
                >
                    Checking in
                </Typography>

                {/* Class name */}
                <Typography
                    variant="body1"
                    sx={{
                        textAlign: "center",
                        marginBottom: 4,
                        color: "black",
                    }}
                >
                    SP2025 CS 499-1C/499L-Q21 CSA 4990qC/499L-Q2/499L-Q21 Senior
                    BS/BSA Capstone
                </Typography>

                {/* Login Button */}
                <Box
                    display="flex"
                    flexDirection={"column"}
                    justifyContent="center"
                    alignItems={"center"}
                    gap={"1em"}
                    sx={{ mt: 2 }}
                >
                    <LoginButton />
                </Box>

                {/* Text about location access */}
                <Typography
                    variant="body2"
                    sx={{
                        textAlign: "center",
                        fontWeight: "bold",
                        color: "black",
                        marginTop: 2, // Adds spacing above the text
                    }}
                >
                    Ensure you are in the correct classroom for your current
                    session. Location access will be required.
                </Typography>
            </Container>
        </>
    );
};

export default Page;
