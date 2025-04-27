import QRCode from "qrcode";

// generate.tsx
export const generate = async (
    element: HTMLCanvasElement | null, 
    loginUrl: string, 
    selectedCourse: string
  ): Promise<{ expireTime: number | null, qrCodeUrl: string | null }> => {
    if (!loginUrl) return { expireTime: null, qrCodeUrl: null };
  
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
        credentials: "include",
        body: JSON.stringify({ id: randomString, courseId: selectedCourse }),
      });
  
      const response = await fetch(`${API_BASE_URL}/api/v1/qr/${randomString}`);
      const data = await response.json();
  
      if (data.valid) {
        console.log("QR code is valid");
        return { expireTime: data.expireTime, qrCodeUrl: uniqueLoginUrl };
      } else {
        console.log("QR code has expired or is invalid");
        return { expireTime: null, qrCodeUrl: null };
      }
    } catch (err) {
      console.error("Failed to generate QR code or link", err);
      return { expireTime: null, qrCodeUrl: null };
    }
};
  

export default generate;
