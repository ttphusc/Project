// import jwtDecode from "jwt-decode"; // Correct import for jwt-decode
// import axios from "axios";
// import { refreshAccessToken } from "./refreshToken"; // Import token refresh function

// export const setupAxiosInterceptors = (accessToken, setAccessToken) => {
//   axios.interceptors.request.use(
//     async (config) => {
//       if (accessToken) {
//         // Decode the access token using jwt-decode
//         const decodedToken = jwtDecode(accessToken);

//         // Get the current time in seconds (since epoch)
//         const currentTime = Math.floor(Date.now() / 1000);

//         // Check if the token will expire in less than 2 days (48 hours)
//         const twoDaysInSeconds = 2 * 24 * 60 * 60;
//         if (decodedToken.exp - currentTime < twoDaysInSeconds) {
//           // Token is expiring in less than 48 hours, refresh it
//           await refreshAccessToken(setAccessToken);
//         }
//       }

//       // Attach the (potentially new) access token to the request headers
//       config.headers.Authorization = `Bearer ${localStorage.getItem(
//         "accessToken"
//       )}`;
//       return config;
//     },
//     (error) => Promise.reject(error)
//   );
// };
