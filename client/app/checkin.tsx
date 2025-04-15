import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";

export const CheckinButton = () => {
    const [location, setLocation] = useState<string | null>(null);
    const [isInside, setIsInside] = useState<boolean | null>(null);
    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude.toFixed(17);
                    const lon = position.coords.longitude.toFixed(17);
                    setLocation(`Latitude: ${lat}, Longitude: ${lon}`);

                    const response = await fetch(
                        `${API_BASE_URL}/api/v1/geofence/check-location`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                latitude: lat,
                                longitude: lon,
                            }),
                        }
                    );

                    const data = await response.json();
                    setIsInside(data.insideGeofence);
                },
                (error) => {
                    alert("Error getting location: " + error.message);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    return (
        <div>
            <Button variant="contained" color="primary" onClick={getLocation}>
                Check-in
            </Button>
            {isInside !== null && (
                <p>
                    {isInside
                        ? "Thank you for using Dragon Verifier. You are now checked in and may close this page"
                        : "Check in failed. Please ensure you are inside the geofence before attempting to check in again"}
                </p>
            )}
        </div>
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

    // Sets the mounted value for the URL to true to test for validity
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Gets the id from the URL to check if it is valid
    useEffect(() => {
        if (isMounted) {
            const params = new URLSearchParams(window.location.search);
            const id = params.get("id");

            if (id) {
                const checkValidity = async () => {
                    const isQRCodeValid = await checkQRCodeValidity(id);
                    setIsValid(isQRCodeValid);
                };
                checkValidity();
            }
        }
    }, [isMounted]);

    return { isValid, isMounted };
};
