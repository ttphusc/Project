import React, { useState, useContext } from "react";
import coverImage from "../../assets/cover.png";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { setUser, setAccessToken } = useContext(AuthContext);
  // ${import.meta.env.VITE_API_URL}
  // console.log(${import.meta.env.VITE_API_URL} || process.env.VITE_API_URL);
  // console.log(${import.meta.env.VITE_API_URL});
  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/user/login`,
        {
          email: email,
          password: password,
        },
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      console.log(response.data.userData);
      console.log(response.data.accessToken);

      setUser(response.data.userData);
      setAccessToken(response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.userData));
      localStorage.setItem("accessToken", response.data.accessToken);

      if (response) {
        try {
          const createAttribute = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/v1/attributes`,
            {},
            {
              headers: {
                Authorization: `Bearer ${response.data.accessToken}`,
              },
            }
          );
          console.log(createAttribute.data);
        } catch (error) {
          // Handle the error for existing attributes
          if (
            error.response &&
            error.response.data.message ===
              "Attributes already exist for this user."
          ) {
            console.log(
              "Attributes already exist. Proceeding to the next step."
            );
          } else {
            console.error("Error creating attributes:", error);
          }
        }
      }

      // Redirect after attribute check
      window.location.href = "/";
    } catch (error) {
      // Xử lý các loại lỗi cụ thể
      if (error.response) {
        const { status, data } = error.response;

        switch (status) {
          case 400:
            switch (data.mes) {
              case "Missing inputs":
                setErrorMessage("Please fill in the email and password");
                break;
              case "User not found":
                setErrorMessage("Email does not exist in the system");
                break;
              case "Password is incorrect":
                setErrorMessage("Password is incorrect");
                break;
              case "Please verify your email before logging in":
                setErrorMessage("Please verify your email before logging in");
                break;
              case "User is blocked":
                setErrorMessage("Your account has been blocked");
                break;
              default:
                setErrorMessage(data.mes || "Login failed");
            }
            break;
          default:
            setErrorMessage("An error occurred, please try again later");
        }
      } else if (error.request) {
        setErrorMessage("Cannot connect to the server");
      } else {
        setErrorMessage("An error occurred, please try again");
      }
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${
      import.meta.env.VITE_API_URL
    }/api/v1/user/auth/google`;
  };

  return (
    <div className="flex h-screen">
      {/* Left Side - Cover Image */}
      <div className="relative w-1/2">
        <img src={coverImage} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#6374AE]/95 via-[#6374AE]/50 to-transparent">
          <div className="absolute bottom-0 p-16">
            <h1 className="font-lobster text-6xl text-white mb-8 drop-shadow-lg">
              FitNutritionHub
            </h1>
            <p className="font-wixmadefor text-xl text-white/90 leading-relaxed max-w-2xl drop-shadow">
              Your go-to destination for delicious recipes, effective exercises,
              and health tips! Discover a variety of nutritious meals that fuel
              your body, explore workout routines to enhance your fitness
              journey, and access valuable health advice to support your
              well-being.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="w-1/2 bg-[#FAF8F6] px-24 py-16 overflow-y-auto">
        <div className="max-w-[500px]">
          <h1 className="font-lobster text-6xl text-[#6374AE] mb-4">
            Welcome Back
          </h1>
          <p className="font-wixmadefor text-[#839DD1] text-xl mb-12">
            Please enter your details to sign in
          </p>

          <form onSubmit={handleSignin} className="space-y-7">
            {/* Email Field */}
            <div>
              <label className="block font-wixmadefor text-[#6374AE] font-semibold text-lg mb-3">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-[64px] pl-14 pr-5 bg-white border-2 border-[#9CB6DD] rounded-xl
                    text-[#6374AE] text-lg focus:outline-none focus:border-[#6374AE] transition-all
                    hover:border-[#6374AE] placeholder-[#9CB6DD]"
                  placeholder="Enter your email"
                />
                <svg
                  className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-[#6374AE]"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17 3.5H7C4 3.5 2 5 2 8.5V15.5C2 19 4 20.5 7 20.5H17C20 20.5 22 19 22 15.5V8.5C22 5 20 3.5 17 3.5ZM17.47 9.59L14.34 12.09C13.68 12.62 12.84 12.88 12 12.88C11.16 12.88 10.31 12.62 9.66 12.09L6.53 9.59C6.21 9.33 6.16 8.85 6.41 8.53C6.67 8.21 7.14 8.15 7.46 8.41L10.59 10.91C11.35 11.52 12.64 11.52 13.4 10.91L16.53 8.41C16.85 8.15 17.33 8.2 17.58 8.53C17.84 8.85 17.79 9.33 17.47 9.59Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block font-wixmadefor text-[#6374AE] font-semibold text-lg mb-3">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-[64px] pl-14 pr-5 bg-white border-2 border-[#9CB6DD] rounded-xl
                    text-[#6374AE] text-lg focus:outline-none focus:border-[#6374AE] transition-all
                    hover:border-[#6374AE] placeholder-[#9CB6DD]"
                  placeholder="Enter your password"
                />
                <svg
                  className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-[#6374AE]"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 19C11.44 19 11 18.55 11 18V15C11 14.45 11.44 14 12 14C12.56 14 13 14.45 13 15V18C13 18.55 12.56 19 12 19Z"
                    fill="currentColor"
                  />
                  <path
                    d="M17.48 7.79V6C17.48 3.24 15.24 1 12.48 1C9.72 1 7.48 3.24 7.48 6V7.79C4.06 8.15 2 9.51 2 12.5V17C2 20.58 4 22 8 22H16C20 22 22 20.58 22 17V12.5C22 9.51 19.94 8.15 17.48 7.79ZM12.48 3C14.13 3 15.48 4.35 15.48 6V7.67H9.48V6C9.48 4.35 10.83 3 12.48 3ZM20 17C20 19.42 18.92 20 16 20H8C5.08 20 4 19.42 4 17V12.5C4 10.08 5.08 9.5 8 9.5H16C18.92 9.5 20 10.08 20 12.5V17Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-5 h-5 rounded-lg border-2 border-[#9CB6DD] text-[#6374AE] 
                    focus:ring-[#6374AE] focus:ring-offset-0 cursor-pointer"
                />
                <label
                  htmlFor="remember"
                  className="font-wixmadefor text-[#6374AE] font-medium text-lg cursor-pointer"
                >
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="font-wixmadefor text-[#6374AE] font-medium text-lg hover:text-[#5A6A9F] 
                  transition-colors hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="text-red-500 text-center font-medium bg-red-50 py-3 rounded-xl">
                {errorMessage}
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-10">
              <button
                type="submit"
                className="w-full h-[64px] bg-[#6374AE] text-white font-wixmadefor font-semibold text-xl
                  rounded-xl hover:bg-[#5A6A9F] transition-all duration-300 shadow-lg hover:shadow-xl
                  mb-6"
              >
                Sign In
              </button>

              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full h-[64px] bg-white text-[#6374AE] font-wixmadefor font-semibold text-xl
                  rounded-xl border-2 border-[#9CB6DD] hover:border-[#6374AE] transition-all duration-300
                  shadow-lg hover:shadow-xl mb-10 flex items-center justify-center gap-3"
              >
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google
              </button>

              {/* Divider */}
              <div className="flex items-center justify-center mb-10">
                <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#9CB6DD] to-transparent"></div>
              </div>

              {/* Sign Up Link */}
              <Link to="/signup">
                <div className="w-full h-[64px] flex items-center justify-center group">
                  <span
                    className="font-wixmadefor text-[#6374AE] font-semibold text-xl 
                    group-hover:text-[#5A6A9F] transition-colors"
                  >
                    Need an account?
                  </span>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="ml-3 text-[#6374AE] transform group-hover:translate-x-1 
                      transition-transform group-hover:text-[#5A6A9F]"
                  >
                    <path
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
