import { useEffect } from "react";

export const useLiveFeedLoader = (setMessages: React.Dispatch<React.SetStateAction<any[]>>) => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

    // Load messages from localStorage on mount
    useEffect(() => {
        const fetchRecent = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/v1/socket/recent-checkins`, {
                    credentials: "include"
                });
                const backendData = await res.json();

                const storedMessages = localStorage.getItem("checkinFeed");
                const localData = storedMessages ? JSON.parse(storedMessages) : [];

                const combined = [...backendData, ...localData];

                // Deduplicates so one user will not fill up the login status page
                const deduped = Object.values(
                    combined.reduce((acc: any, curr: any) => {
                        const id = curr.canvasUser.id;
                        const existing = acc[id];

                        // Else block prioritizes success over fail, and newer over older
                        if (!existing) {
                            acc[id] = curr;
                        } else {
                            const existingTime = new Date(existing.timestamp).getTime();
                            const currTime = new Date(curr.timestamp).getTime();

                            if (
                                (!existing.success && curr.success) ||
                                (existing.success === curr.success && currTime > existingTime)
                            ) {
                                acc[id] = curr;
                            }
                        }
                        return acc;
                    }, {})
                );

                setMessages(deduped);
            } catch (error) {
                console.error("Error fetching recent check-ins:", error);
            }
        };

        fetchRecent();

        const ws = new WebSocket(API_BASE_URL.replace("https", "wss"));

        ws.onopen = () => {
            console.log("Connected to WebSocket server ✅");
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "checkin_attempt") {
                const newMessage = data.data;
                const userId = newMessage.canvasUser.id;

                // Prevents duplicate messages from the same student
                setMessages((prevMessages) => {
                    const existing = prevMessages.find((msg) => msg.canvasUser.id === userId);

                    if (!existing) {
                        return [newMessage, ...prevMessages];
                    }
                    if (!existing.success && newMessage.success) {
                        return [newMessage, ...prevMessages];
                    }
                    return prevMessages;
                });
            }
        };

        ws.onclose = () => {
            console.log("Disconnected from WebSocket server ❌");
        };

        return () => ws.close();
    }, [setMessages]);
};

export default useLiveFeedLoader;
