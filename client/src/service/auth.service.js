const refreshToken = async () => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/v1/user/refreshtoken`,
      {},
      {
        withCredentials: true, // Để gửi cookie refresh token
      }
    );

    if (response.data.success) {
      localStorage.setItem("accessToken", response.data.newAccessToken);
      return response.data.newAccessToken;
    }
    return null;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};

export default refreshToken;
