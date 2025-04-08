import QRCode from "qrcode";

export const generate = async (element: HTMLCanvasElement | null, loginUrl: string) => {
  if (!element) return;
  const randomString = Math.random().toString(36).substring(2, 15);
  const uniqueLoginUrl = `${loginUrl}?id=${randomString}`;

  try {
    await QRCode.toCanvas(element, uniqueLoginUrl, {
      errorCorrectionLevel: "H",
      width: 400,
    });
    console.log("QR code generated");
  } catch (err) {
    console.error("Failed to generate QR code", err);
  }
};

export default generate;

