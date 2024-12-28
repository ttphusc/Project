import { useState, useEffect } from 'react';
import axios from 'axios';
const ChatUserList = ({ onSelectUser, onClose }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    const fetchUsers = async (page = 1) => {
            setLoading(true);
            try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/v1/user`,
            {
              params: { page, limit: 10, search: searchTerm },
                headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
          if (response.data.success) {
            setUsers(response.data.users);
            setTotalPages(response.data.totalPages);
          } else {
            console.error("Failed to fetch users:", response.data);
          }
        } catch (error) {
          console.error("Error fetching users:", error);
          setErrorMessage("Failed to load users. Please try again later.");
        }
        setLoading(false);
      };    
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 w-96 max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Chọn người nhận tin nhắn</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <input
          type="text"
          placeholder="Tìm kiếm người dùng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded-lg mb-4"
        />

        <div className="overflow-y-auto flex-1">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => onSelectUser(user)}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
            >
              <img
                src={user.avatar || 'default-avatar.png'}
                alt={user.firstname}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{`${user.firstname} ${user.lastname}`}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatUserList;