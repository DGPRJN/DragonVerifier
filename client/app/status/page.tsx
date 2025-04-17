"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";

export const CheckinFeed = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

    useEffect(() => {
        const ws = new WebSocket(API_BASE_URL.replace("https", "wss"));

        ws.onopen = () => {
            console.log("Connected to WebSocket server ✅");
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "checkin_attempt") {
                setMessages((prev) => [data.data, ...prev]);
            }
        };

        ws.onclose = () => {
            console.log("Disconnected from WebSocket server ❌");
        };

        return () => ws.close();
    }, []);

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
                            User: Id: {msg.canvasUser.id}, Name:{" "}
                            {msg.canvasUser.name}
                        </ListItemText>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default CheckinFeed;
