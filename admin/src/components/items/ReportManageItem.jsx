import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiSearch,
  FiFilter,
  FiDownload,
  FiFlag,
  FiMoreVertical,
  FiTrash2,
  FiCheck,
  FiX,
  FiAlertCircle,
} from "react-icons/fi";
import { toast } from "react-toastify";

const ReportManageItem = () => {
  const [selectedReports, setSelectedReports] = useState([]);
  const [reports, setReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [newReport, setNewReport] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    phone: "",
    address: "",
    dob: "",
    gender: "",
  });
  const [editingReport, setEditingReport] = useState(null);

  // Lấy access token từ localStorage
  const accessToken = localStorage.getItem("accessToken");

  const handleSelectReport = (index) => {
    setSelectedReports((prevSelected) =>
      prevSelected.includes(index)
        ? prevSelected.filter((i) => i !== index)
        : [...prevSelected, index]
    );
  };
  // Hàm để lấy danh sách người dùng từ server
  const fetchReports = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/report`,
        {
          params: { page, limit: 10, search: searchQuery, type: filterType },
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (response.data.success) {
        console.log(response.data.reports);
        setReports(response.data.reports);
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
  const submitDeletedReport = async (rid) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/report/${rid}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data.success) {
        fetchReports(currentPage);
      } else {
        console.error("Failed to delete user:", response.data);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setErrorMessage("Failed to update user. Please try again later.");
    }
  };
  const submitUpdateReport = async (report) => {
    const status = report.status === "Wait" ? "Done" : "Wait";
    console.log(status);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/report/${report._id}`,
        { status: status },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data.success) {
        fetchReports(currentPage);
      } else {
        console.error("Failed to toggle block status:", response.data);
      }
    } catch (error) {
      console.error("Error toggling block status:", error);
      setErrorMessage("Failed to update user. Please try again later.");
    }
  };
  // Gọi hàm fetchReports khi component được render hoặc khi currentPage, searchQuery, filterRole thay đổi

  useEffect(() => {
    fetchReports(currentPage);
  }, [currentPage, searchQuery, filterType]);

  // Hàm để thay đổi trang hiện tại
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleTypeChange = (e) => {
    setFilterType(e.target.value);
  };
  const handleMenuClick = (index) => {
    setMenuVisible(menuVisible === index ? null : index);
  };
  const handleDeleteReport = (report) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${report._id} ?`
    );
    if (confirmDelete) {
      submitDeletedReport(report._id);
    }
  };

  const handleReportUpdate = (report) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to update ${report._id} ?`
    );
    if (confirmDelete) {
      submitUpdateReport(report);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Done":
        return "bg-green-100 text-green-800";
      case "Wait":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type) => {
    return type === "post"
      ? "bg-blue-100 text-blue-800"
      : "bg-purple-100 text-purple-800";
  };

  return (
    <div className="p-8">
      <div className="w-[1400px] mx-auto bg-white rounded-2xl shadow-sm">
        {/* Header Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <FiFlag className="text-[#6374AE] w-8 h-8" />
              <h2 className="text-2xl font-semibold text-gray-800">
                Report Management
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                Total Reports: {reports.length}
              </span>
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
                placeholder="Search reports..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6374AE] focus:border-transparent"
              />
            </div>
            {/* <div className="flex gap-3">
              <select
                onChange={handleTypeChange}
                value={filterType}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6374AE]"
              >
                <option value="">All Types</option>
                <option value="post">Post Reports</option>
                <option value="question">Question Reports</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <FiDownload size={18} />
                <span>Export</span>
              </button>
            </div> */}
          </div>
        </div>

        {/* Reports List */}
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4">
            {reports.map((report, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                          report.idPost ? "post" : "question"
                        )}`}
                      >
                        {report.idPost ? "Post Report" : "Question Report"}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          report.status
                        )}`}
                      >
                        {report.status}
                      </span>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">
                          Report ID: {report._id}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          Reported by: {report.idUser}
                        </p>
                        <div className="bg-gray-50 rounded-lg p-3 mb-2">
                          <p className="text-gray-700">
                            <FiAlertCircle className="inline-block mr-2 text-yellow-500" />
                            {report.reasonReport}
                          </p>
                        </div>
                        <div className="text-sm text-gray-500">
                          Reported on:{" "}
                          {new Date(report.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleReportUpdate(report)}
                          className={`p-2 rounded-full ${
                            report.status === "Wait"
                              ? "bg-green-100 text-green-600 hover:bg-green-200"
                              : "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                          }`}
                        >
                          {report.status === "Wait" ? (
                            <FiCheck size={20} />
                          ) : (
                            <FiX size={20} />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteReport(report)}
                          className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                        >
                          <FiTrash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-6 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            Showing {reports.length} of {totalPages * 10} reports
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

export default ReportManageItem;
