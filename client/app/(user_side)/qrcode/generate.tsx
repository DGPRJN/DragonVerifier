import QRCode from "qrcode";

export const generate = async (
    element: HTMLCanvasElement | null,
    loginUrl: string
) => {
    if (!element) return;
    const randomString = Math.random().toString(36).substring(2, 15);
    const uniqueLoginUrl = `${loginUrl}/login/?id=${randomString}`;
    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_LOCAL;

    try {
        await QRCode.toCanvas(element, uniqueLoginUrl, {
            errorCorrectionLevel: "H",
            width: 400,
        });

        await fetch(`${API_BASE_URL}/api/v1/qr`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: randomString }),
        });

        // Check if the QR code is still valid by calling the backend
        await new Promise((resolve) => setTimeout(resolve, 6000));
        const response = await fetch(
            `${API_BASE_URL}/api/v1/qr/${randomString}`
        );
        const data = await response.json();

        if (data.valid) {
            console.log("QR code is valid");
        } else {
            console.log("QR code has expired or is invalid");
        }
    } catch (err) {
        console.error("Failed to generate QR code", err);
    }
};

export default generate;
