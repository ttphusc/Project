import { useEffect, useState } from 'react';
import socket from '../../config/socket';
import { useNavigate } from 'react-router-dom';
import './popup.css';

const BlockNotification = () => {
  const navigate = useNavigate();

 // Lấy thông tin user từ localStorage, xử lý trường hợp null
  const user = JSON.parse(localStorage.getItem('user')) || null;
  const currentUserId = user?._id; // Dùng optional chaining để tránh lỗi
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    socket.on('userBlocked', (data) => {
      console.log('📌 Received userBlocked event:', data);
      
      if (data.blockedUserId === currentUserId) {
        setShowPopup(true);
        setTimeout(() => {
          localStorage.clear();
          navigate('/signin');
        }, 5000);
      }
    });

    return () => {
      socket.off('userBlocked');
    };
  }, [currentUserId, navigate]);

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative animate-fadeIn">
        <div className="flex flex-col items-center text-center">
          {/* Icon cảnh báo */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg 
              className="w-8 h-8 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* Tiêu đề */}
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Account Blocked
          </h3>

          {/* Nội dung */}
          <p className="text-gray-500 mb-6">
            Your account has been blocked. You will be redirected to the login page after 5 seconds.
          </p>

          {/* Thanh progress */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div className="bg-blue-500 h-2.5 rounded-full animate-progress"></div>
          </div>

          {/* Nút đóng */}
          <button
            onClick={() => {
              localStorage.clear();
              navigate('/signin');
            }}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Login again
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockNotification;