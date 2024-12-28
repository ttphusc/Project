import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react"; // Import the FullCalendar component
import dayGridPlugin from "@fullcalendar/daygrid"; // Import plugins you need
import interactionPlugin from "@fullcalendar/interaction"; // Enables user interactions
import axios from "axios"; // For data fetching

const EventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [selectedDateTasks, setSelectedDateTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        console.log(token);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/event/getcurrent`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Response data:", response.data);
        const formattedEvents = response.data.events.map((event) => ({
          title: event.title,
          start: event.timeStart,
          end: event.timeEnd,
          description: event.description,
          dailyTodoList: event.dailyToDoLists,
          backgroundColor: "yellow", // Set default yellow background for span events
        }));
        setEvents(formattedEvents);

        // Function to check if two dates match by day, month, and year
        const isSameDate = (date1, date2) => {
          const d1 = new Date(date1);
          const d2 = new Date(date2);
          return (
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate()
          );
        };

        // Filtering tasks for today's date
        const today = new Date();
        const tasksForToday = response.data.events
          .map((event) => ({
            eventId: event._id,
            title: event.title,
            tasks: event.dailyToDoLists
              .filter((entry) => isSameDate(entry.date, today))
              .flatMap((entry) => entry.tasks),
          }))
          .filter((event) => event.tasks.length > 0); // Filter out events with no tasks for today

        setTodayTasks(tasksForToday);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);
  const handleDateClick = (info) => {
    const clickedDate = new Date(info.dateStr);
    setSelectedDate(clickedDate);

    // Filter tasks for the selected date
    const tasksForSelectedDate = events
      .map((event) => ({
        eventId: event._id,
        title: event.title,
        tasks: event.dailyTodoList
          .filter(
            (entry) =>
              new Date(entry.date).toDateString() === clickedDate.toDateString()
          )
          .flatMap((entry) => entry.tasks),
      }))
      .filter((event) => event.tasks.length > 0);

    setSelectedDateTasks(tasksForSelectedDate);
    console.log(selectedDateTasks);
  };
  const updateTaskCompletionStatus = async (eid, date, taskId, isCompleted) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/event/${eid}/todo/task`,
        { date, taskId, isCompleted },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        console.log("Task status updated successfully");
        // Refresh tasks or state here if needed
      } else {
        console.error("Failed to update task status:", response.data);
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleCheckboxChange = (eventId, date, taskId, currentStatus) => {
    // Debugging log
    console.log("handleCheckboxChange called with:", {
      eventId,
      date,
      taskId,
      currentStatus,
    });

    if (!eventId) {
      console.error("eventId is undefined or null");
      return;
    }

    const newStatus = !currentStatus;
    updateTaskCompletionStatus(eventId, date, taskId, newStatus);

    // Update the local state for immediate UI feedback (optional)
    setTodayTasks((prevTasks) =>
      prevTasks.map((event) =>
        event.eventId === eventId
          ? {
              ...event,
              tasks: event.tasks.map((task) =>
                task._id === taskId ? { ...task, isCompleted: newStatus } : task
              ),
            }
          : event
      )
    );
  };

  return (
    <div className="p-8 bg-[#F2F7FB] rounded-[30px] border-[3px] border-[#6374AE]">
      {/* Today's Tasks Section */}
      <div className="mb-8">
        <h1 className="text-[#6374AE] font-wixmadefor text-3xl font-bold mb-6">
          Today's Tasks
        </h1>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          {todayTasks.length > 0 ? (
            todayTasks.map((event, index) => (
              <div key={index} className="mb-4 last:mb-0">
                <h2 className="text-[#6374AE] font-wixmadefor text-xl font-semibold mb-3">
                  {event.title}
                </h2>
                <div className="space-y-2">
                  {event.tasks.map((task, idx) => (
                    <div key={idx} className="flex items-center gap-3 pl-2">
                      <input
                        type="checkbox"
                        checked={task.isCompleted}
                        onChange={() =>
                          handleCheckboxChange(
                            event.eventId,
                            task.date,
                            task._id,
                            task.isCompleted
                          )
                        }
                        className="w-5 h-5 rounded-lg border-2 border-[#9CB6DD] checked:bg-[#6374AE] transition-colors cursor-pointer"
                      />
                      <p
                        className={`text-lg ${
                          task.isCompleted
                            ? "text-[#6374AE] font-medium line-through"
                            : "text-[#262C40]"
                        }`}
                      >
                        {task.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-[#839DD1] text-lg">
              No tasks scheduled for today.
            </p>
          )}
        </div>
      </div>

      {/* Selected Date Tasks Section */}
      {selectedDate && (
        <div className="mb-8">
          <h2 className="text-[#6374AE] font-wixmadefor text-2xl font-bold mb-4">
            Tasks for {selectedDate.toDateString()}
          </h2>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            {selectedDateTasks.length > 0 ? (
              selectedDateTasks.map((event, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <h3 className="text-[#6374AE] font-wixmadefor text-xl font-semibold mb-3">
                    {event.title}
                  </h3>
                  <div className="space-y-2 pl-2">
                    {event.tasks.map((task, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <p
                          className={`text-lg ${
                            task.isCompleted
                              ? "text-[#6374AE] font-medium"
                              : "text-[#262C40]"
                          }`}
                        >
                          {task.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[#839DD1] text-lg">
                No tasks scheduled for this date.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Calendar Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridWeek",
          }}
          contentHeight="auto"
          dateClick={handleDateClick}
          eventContent={(arg) => (
            <div className="p-2 rounded-lg bg-[#9CB6DD] hover:bg-[#6374AE] transition-colors cursor-pointer">
              <div className="text-white font-medium">{arg.event.title}</div>
              {arg.event.extendedProps.description && (
                <div className="text-white text-sm mt-1">
                  {arg.event.extendedProps.description}
                </div>
              )}
            </div>
          )}
          // Custom Calendar Styling
          className="custom-calendar"
        />
      </div>

      {/* Add custom CSS for calendar */}
      <style jsx>{`
        .custom-calendar {
          --fc-border-color: #e5e7eb;
          --fc-button-bg-color: #6374ae;
          --fc-button-border-color: #6374ae;
          --fc-button-hover-bg-color: #5a6a9f;
          --fc-button-hover-border-color: #5a6a9f;
          --fc-today-bg-color: #f8faff;
        }

        .custom-calendar .fc-button {
          padding: 8px 16px;
          font-weight: 500;
          border-radius: 10px;
        }

        .custom-calendar .fc-toolbar-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #262c40;
        }

        .custom-calendar .fc-day-today {
          background: var(--fc-today-bg-color) !important;
        }
      `}</style>
    </div>
  );
};

export default EventCalendar;
