import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser, setAccessToken } = useContext(AuthContext);

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const userId = searchParams.get("userId");

    if (accessToken && userId) {
      // Lấy thông tin user
      const fetchUserData = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/v1/user/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          setUser(response.data.rs);
          setAccessToken(accessToken);
          localStorage.setItem("user", JSON.stringify(response.data.rs));
          localStorage.setItem("accessToken", accessToken);

          navigate("/");
        } catch (error) {
          console.error("Error fetching user data:", error);
          navigate("/signin");
        }
      };

      fetchUserData();
    } else {
      navigate("/signin");
    }
  }, [searchParams, navigate, setUser, setAccessToken]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#6374AE] mx-auto"></div>
        <p className="mt-4 text-[#6374AE] font-wixmadefor text-xl">
          Đang xử lý đăng nhập...
        </p>
      </div>
    </div>
  );
};

export default GoogleCallback;
