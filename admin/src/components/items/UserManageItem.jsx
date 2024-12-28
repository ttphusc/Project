import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FiSearch,
  FiFilter,
  FiDownload,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiLock,
  FiUnlock,
  FiMoreVertical,
} from "react-icons/fi";
import socket from "../../configs/socket";
import { toast } from "react-toastify";
const UserManageItem = () => {
  // Khai báo các state để quản lý dữ liệu người dùng và trạng thái của component
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [filterRole, setFilterRole] = useState("");
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    phone: "",
    address: "",
    dob: "",
    gender: "",
  });
  const [editingUser, setEditingUser] = useState(null);

  // Lấy access token từ localStorage
  const accessToken = localStorage.getItem("accessToken");
  // Hàm để chọn hoặc bỏ chọn người dùng
  const handleSelectUser = (index) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(index)
        ? prevSelected.filter((i) => i !== index)
        : [...prevSelected, index]
    );
  };

  // Hàm để lấy danh sách người dùng từ server
  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/user`,
        {
          params: { page, limit: 10, search: searchQuery, role: filterRole },
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
  // Gọi hàm fetchUsers khi component được render hoặc khi currentPage, searchQuery, filterRole thay đổi

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, searchQuery, filterRole]);
  useEffect(() => {
    // Lắng nghe sự kiện block user
    socket.on("userBlocked", (data) => {
      toast.info(data.message);
      // Refresh lại danh sách users
      fetchUsers(currentPage);
    });

    return () => {
      socket.off("userBlocked");
    };
  }, [currentPage]);

  // Hàm để thay đổi trang hiện tại
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Hàm để tạo người dùng mới
  const handleCreateUser = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/user/register`,
        newUser
      );
      if (response.data.success) {
        fetchUsers(currentPage); // Refresh user list after adding
        setIsCreateFormVisible(false); // Close form after successful creation
      } else {
        console.error("Failed to create user:", response.data);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setErrorMessage("Failed to create user. Please try again later.");
    }
  };
  const submitUpdatedUser = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/user/${editingUser._id}`,
        editingUser,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data.message) {
        setEditingUser(null);
        fetchUsers(currentPage);
      } else {
        console.error("Failed to update user:", response.data);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setErrorMessage("Failed to update user. Please try again later.");
    }
  };
  const submitDeletedUser = async (uid) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/user/${uid}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data.message) {
        fetchUsers(currentPage);
      } else {
        console.error("Failed to delete user:", response.data);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setErrorMessage("Failed to update user. Please try again later.");
    }
  };
  const handleBlockUser = async (userId, currentBlockStatus) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/user/block/${userId}`,
        { isBlocked: !currentBlockStatus },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        fetchUsers(currentPage);
      }
    } catch (error) {
      console.error("Error toggling block status:", error.message);
      toast.error("Không thể khóa/mở khóa tài khoản");
    }
  };
  // Hàm để xử lý thay đổi input cho người dùng mới
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };
  // Hàm để xử lý thay đổi input cho người dùng đang chỉnh sửa
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };
  // Hàm để hiển thị hoặc ẩn menu
  const handleMenuClick = (index) => {
    setMenuVisible(menuVisible === index ? null : index);
  };

  // Hàm để cập nhật người dùng
  const handleUpdateUser = (user) => {
    setEditingUser(user);
  };
  // Hàm để xoa người dùng
  const handleDeleteUser = (user) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${user.firstname} ${user.lastname}?`
    );
    if (confirmDelete) {
      submitDeletedUser(user._id);
    }
  };
  // Hàm để block người dùng
  // const handleBlockUser = (user) => {
  //   const confirmDelete = window.confirm(
  //     `Are you sure you want to block ${user.firstname} ${user.lastname}?`
  //   );
  //   if (confirmDelete) {
  //     handleBlockUser(user._id);
  //   }
  // };
  // Hàm để xử lý thay đổi input cho tìm kiếm
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleRoleChange = (e) => {
    setFilterRole(e.target.value);
  };
  return (
    <div className="p-8">
      <div className="w-[1400px] mx-auto bg-white rounded-2xl shadow-sm">
        {/* Header Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              User Management
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCreateFormVisible(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#6374AE] text-white rounded-lg hover:bg-[#4A5578] transition-colors"
              >
                <FiPlus size={20} />
                <span>Add User</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6374AE] focus:border-transparent"
              />
            </div>
            <div className="flex gap-3">
              <select
                onChange={handleRoleChange}
                value={filterRole}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6374AE]"
              >
                <option value="">All Roles</option>
                <option value="user">User</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </div>
        </div>

        {/* Edit Form Modal */}
        {editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4">
              <h3 className="text-xl font-semibold mb-4">Edit User</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editingUser.email}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6374AE]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstname"
                    value={editingUser.firstname}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6374AE]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastname"
                    value={editingUser.lastname}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6374AE]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={editingUser.phone}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6374AE]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={editingUser.address}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6374AE]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={editingUser.gender}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6374AE]"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={editingUser.dob}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6374AE]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={submitUpdatedUser}
                  className="px-4 py-2 bg-[#6374AE] text-white rounded-lg hover:bg-[#4A5578]"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-[#6374AE] focus:ring-[#6374AE]"
                  />
                </th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user, index) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(index)}
                      onChange={() => handleSelectUser(index)}
                      className="rounded border-gray-300 text-[#6374AE] focus:ring-[#6374AE]"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {user.firstname?.[0]}
                            {user.lastname?.[0]}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">
                          {user.firstname} {user.lastname}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-900">{user.phone}</div>
                    <div className="text-sm text-gray-500">{user.address}</div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${
                        user.isBlocked
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="relative">
                      <button
                        onClick={() => handleMenuClick(index)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <FiMoreVertical size={20} />
                      </button>
                      {menuVisible === index && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                          <button
                            onClick={() => handleUpdateUser(user)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <FiEdit2 className="mr-3" size={16} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                          >
                            <FiTrash2 className="mr-3" size={16} />
                            Delete
                          </button>
                          <button
                            onClick={() =>
                              handleBlockUser(user._id, user.isBlocked)
                            }
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            {user.isBlocked ? (
                              <>
                                <FiUnlock className="mr-3" size={16} />
                                Unblock
                              </>
                            ) : (
                              <>
                                <FiLock className="mr-3" size={16} />
                                Block
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-6 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            Showing {users.length} of {totalPages * 10} results
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-200 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === i + 1
                    ? "bg-[#6374AE] text-white"
                    : "border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-200 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManageItem;
