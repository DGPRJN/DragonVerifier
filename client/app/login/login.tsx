import { useState, useEffect } from 'react';

export const login = () => {
  console.log("Login Button Clicked");
}


// Function to check QR Code Validity
const checkQRCodeValidity = async (id: string) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_LOCAL;
  const response = await fetch(`${API_BASE_URL}api/qr/${id}`);

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


export default login;
