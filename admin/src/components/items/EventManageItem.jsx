import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiSearch,
  FiFilter,
  FiDownload,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiMoreVertical,
} from "react-icons/fi";
import { BsCalendarEvent, BsCalendarCheck } from "react-icons/bs";
import { toast } from "react-toastify";

const EventManageItem = () => {
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    timeStart: "",
    timeEnd: "",
  });

  // Access token (use environment variables or secure storage in real projects)
  const accessToken = localStorage.getItem("accessToken");
  // Function to select or deselect events
  const handleSelectEvent = (index) => {
    setSelectedEvents((prevSelected) =>
      prevSelected.includes(index)
        ? prevSelected.filter((i) => i !== index)
        : [...prevSelected, index]
    );
  };

  // Function to fetch events from the server
  const fetchEvents = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/event`,
        {
          params: { page, limit: 10, search: searchQuery },
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (response.data.success) {
        setEvents(response.data.events);
        setTotalPages(response.data.totalPages);
      } else {
        setErrorMessage("Failed to fetch events.");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setErrorMessage("Failed to load events. Please try again later.");
    }
    setLoading(false);
  };

  const submitDeletedEvent = async (eid) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/event/${eid}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (response.data.success) {
        fetchEvents(currentPage);
      } else {
        console.error("Failed to delete event:", response.data);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      setErrorMessage("Failed to delete event. Please try again later.");
    }
  };

  const submitUpdatedEvent = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/event/${editingEvent._id}`,
        editingEvent,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (response.data.success) {
        setEditingEvent(null);
        fetchEvents(currentPage);
      } else {
        console.error("Failed to update event:", response.data);
      }
    } catch (error) {
      console.error("Error updating event:", error);
      setErrorMessage("Failed to update event. Please try again later.");
    }
  };

  const handleCreateEvent = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/event`,
        newEvent,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (response.data.success) {
        setNewEvent({
          title: "",
          description: "",
          timeStart: "",
          timeEnd: "",
        });
        fetchEvents(currentPage); // Refresh event list after adding
        setIsCreateFormVisible(false); // Close form after successful creation
      } else {
        console.error("Failed to create event:", response.data);
      }
    } catch (error) {
      console.error("Error creating event:", error);
      setErrorMessage("Failed to create event. Please try again later.");
    }
  };

  useEffect(() => {
    fetchEvents(currentPage);
  }, [currentPage, searchQuery]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleMenuClick = (index) => {
    setMenuVisible(menuVisible === index ? null : index);
  };

  const handleDeleteEvent = (event) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${event._id}?`
    );
    if (confirmDelete) {
      submitDeletedEvent(event._id);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  const handleUpdateEvent = (event) => {
    setEditingEvent(event);
  };
  const formatDateToInputValue = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div className="p-8">
      <div className="w-[1400px] mx-auto bg-white rounded-2xl shadow-sm">
        {/* Header Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Event Management
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCreateFormVisible(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#6374AE] text-white rounded-lg hover:bg-[#4A5578] transition-colors"
              >
                <FiPlus size={20} />
                <span>Add Event</span>
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
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6374AE] focus:border-transparent"
              />
            </div>
            {/* <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <FiFilter size={18} />
                <span>Filter</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <FiDownload size={18} />
                <span>Export</span>
              </button>
            </div> */}
          </div>
        </div>

        {/* Edit Form */}
        {editingEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4">
              <h3 className="text-xl font-semibold mb-4">Edit Event</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={editingEvent.title}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6374AE]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={editingEvent.description}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6374AE]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    name="timeStart"
                    value={formatDateToInputValue(editingEvent.timeStart)}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6374AE]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    name="timeEnd"
                    value={formatDateToInputValue(editingEvent.timeEnd)}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6374AE]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={submitUpdatedEvent}
                  className="px-4 py-2 bg-[#6374AE] text-white rounded-lg hover:bg-[#4A5578]"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Form */}
        {isCreateFormVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4">
              <h3 className="text-xl font-semibold mb-4">Create New Event</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tương tự như Edit Form */}
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
                  Event
                </th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Creator
                </th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participants
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
              {events.map((event, index) => (
                <tr key={event._id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedEvents.includes(index)}
                      onChange={() => handleSelectEvent(index)}
                      className="rounded border-gray-300 text-[#6374AE] focus:ring-[#6374AE]"
                    />
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {event.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {event.description}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {typeof event.userCreate === "object"
                      ? event.userCreate._id
                      : event.userCreate}
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-900">
                      {new Date(event.timeStart).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(event.timeStart).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-900">
                    {event.participants?.length || 0}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${
                        event.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {event.status}
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
                            onClick={() => handleUpdateEvent(event)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <FiEdit2 className="mr-3" size={16} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event)}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                          >
                            <FiTrash2 className="mr-3" size={16} />
                            Delete
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
            Showing {events.length} of {totalPages * 10} results
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

export default EventManageItem;
