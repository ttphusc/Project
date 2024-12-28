import axios from "axios";

// Utility function to refresh access token
export const refreshAccessToken = async (setAccessToken) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/v1/user/refresh-token`
    );
    const { accessToken } = response.data;
    localStorage.setItem("accessToken", accessToken);
    setAccessToken(accessToken);
  } catch (error) {
    console.error("Failed to refresh access token", error);
  }
};
