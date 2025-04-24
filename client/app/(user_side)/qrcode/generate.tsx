import QRCode from "qrcode";

export const generate = async (
  element: HTMLCanvasElement | null, loginUrl: string): Promise<string | null> => {
  if (!loginUrl) return null;

  const randomString = Math.random().toString(36).substring(2, 15);
  const uniqueLoginUrl = `${loginUrl}/?id=${randomString}`;
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  try {
    if (element) {
      await QRCode.toCanvas(element, uniqueLoginUrl, {
        errorCorrectionLevel: "H",
        width: 400,
      });
    }
    
    await fetch(`${API_BASE_URL}/api/v1/qr`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: randomString }),
    });

    const response = await fetch(`${API_BASE_URL}/api/v1/qr/${randomString}`);
    const data = await response.json();

    if (data.valid) {
      console.log("QR code is valid");
    } else {
      console.log("QR code has expired or is invalid");
    }

    return uniqueLoginUrl;
  } catch (err) {
    console.error("Failed to generate QR code or link", err);
    return null;
  }
};

export default generate;
