import React, { useState, useEffect } from "react";
import { Box, Button, Container, Typography } from "@mui/material";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const CheckinButton = () => {
    const [location, setLocation] = useState<string | null>(null);
    const [isInside, setIsInside] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const getLocation = () => {
        if (navigator.geolocation && !isLoading) {
            setIsLoading(true);
            console.log("Do not forget to enable button disabler on checkin.tsx");

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude.toFixed(17);
                    const lon = position.coords.longitude.toFixed(17);
                    setLocation(`Latitude: ${lat}, Longitude: ${lon}`);
                    
                    
                    const response = await fetch(
                        `${API_BASE_URL}/api/v1/socket/check-location`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            credentials: "include",
                            body: JSON.stringify({
                                latitude: lat,
                                longitude: lon,
                            }),
                        }
                    );

                    const data = await response.json();
                    setIsInside(data.insideGeofence);
                    setIsLoading(false);
                },
                (error) => {
                    alert("Error getting location: " + error.message);
                    setIsLoading(false);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                }
            );
        } else {
            alert("Unable to access geolocation at this time");
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            <Button
                variant="contained"
                color="primary"
                onClick={getLocation}
                sx={{ fontSize: "1.2rem", width: "400px" }}
            >
                Check-in
            </Button>
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="80px"
                >
                    {isInside !== null && (
                        <Typography
                            variant="body1"
                            sx={{
                                textAlign: "center",
                                color: isInside ? "green" : "red",
                                fontWeight: "bold",
                                maxWidth: "100%",
                            }}
                        >
                            {isInside
                                ? "Thank you for using Dragon Verifier. You are now checked in and may close this page"
                                : "Check-in failed. Please ensure you are inside the classroom before attempting to check in again"}
                        </Typography>
                    )}
                </Box>
            </Container>
        </Box>
    );
};

// Function to check QR Code Validity
const checkQRCodeValidity = async (id: string) => {
    const response = await fetch(`/api/v1/qr/${id}`);

    if (!response.ok) {
        return false;
    }

    const data = await response.json();
    return data.valid;
};

// Function for QR Code Validation
export const qrcvalidation = () => {
    const [isValid, setIsValid] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [role, setRole] = useState<string | null>(null);

    // Sets the mounted value for the URL to true to test for validity
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Gets the id from the URL to check if it is valid
    useEffect(() => {
        if (!isMounted) return;

        const redirectURL = process.env.NEXT_PUBLIC_FRONTEND_URL;
    
        const checkQRAndID = async () => {
            const params = new URLSearchParams(window.location.search);
            const id = params.get("id");
    
            const response = await fetch(`${API_BASE_URL}/api/v1/oauth/whoami`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
    
            const data = await response.json();

            setRole(data.role);

            if (data.role === "Instructor") {return;} else {

                if (id) {
                    window.sessionStorage.setItem("checkinId", id);
                    if (data.success) {
                        const isQRCodeValid = await checkQRCodeValidity(id);
                        setIsValid(isQRCodeValid);
                    } else {
                        setTimeout(() => {
                            window.location.href = `${redirectURL}/login`;
                        }, 1000);
                    }

                } else {
                    const savedId = window.sessionStorage.getItem("checkinId");
                    
                    if (savedId) {
                        if (data.success) {
                            const isQRCodeValid = await checkQRCodeValidity(savedId);
                            setIsValid(isQRCodeValid);
                        }
                    }
                }
            }
        };
        checkQRAndID();
    }, [isMounted]);
    
    

    return { isValid, isMounted, role };
};
