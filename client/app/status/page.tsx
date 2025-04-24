"use client";

import React, { useState, useEffect } from "react";
import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useLiveFeedLoader } from "./status";
import router from "next/router";

export const Page = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    useEffect(() => {
        const checkRole = async () => {
            try {
                const roleResponse = await fetch(`${API_BASE_URL}/api/v1/oauth/whoami`, {
                    credentials: "include",
                });

                if (!roleResponse.ok) {
                    throw new Error("Failed to fetch user role");
                }

                const roleData = await roleResponse.json();
                if (roleData.role !== "Instructor") {
                    window.location.href = `/`;
                }
            } catch (err) {
                console.error("Failed to fetch user role", err);
                window.location.href = `/`; // Redirect on error as well
            }
        };

        checkRole();
    }, []);

    useLiveFeedLoader(setMessages);

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Live Check-in Attempts
            </Typography>
            <List>
                {messages.map((msg, idx) => (
                    <ListItem key={idx}>
                        <ListItemText
                            primary={`Location: (${msg.latitude}, ${msg.longitude})`}
                            secondary={`Status: ${
                                msg.success ? "✅ Success" : "❌ Failed"
                            } at ${new Date(msg.timestamp).toLocaleString()}`}
                        />
                        <ListItemText>
                            User: Id: {msg.canvasUser.id}, Name: {msg.canvasUser.name}
                        </ListItemText>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default Page;
