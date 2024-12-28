const Event = require("../models/event");
const { eventNames } = require("../models/recipe");
const User = require("../models/user");
const { ObjectId } = require("mongodb");
const asyncHandler = require("express-async-handler");

const updateEvent = asyncHandler(async (req, res) => {
  const { eid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing input");
  const response = await Event.findByIdAndUpdate(eid, req.body, {
    new: true,
  });
  return res.json({
    success: response ? true : false,
    updateEvent: response ? response : "cannot update new Event",
  });
});

const deleteEvent = asyncHandler(async (req, res) => {
  const { eid } = req.params;
  const { _id } = req.user;
  const event = await Event.findById(eid);
  if (!event) throw new Error("Event not found");
  const response = await Event.findByIdAndDelete(eid);
  if (response) {
    await User.findByIdAndUpdate(
      _id,
      { $pull: { idEvent: eid } },
      { new: true }
    );
  }
  return res.json({
    success: response ? true : false,
    deleteEvent: response ? response : "cannot delete Event",
  });
});

// const getEvent = asyncHandler(async (req, res) => {
//   const { eid } = req.params;
//   const event = await Event.findById(eid);
//   return res.status(200).json({
//     success: event ? true : false,
//     rs: event,
//   });
// });

const getEvents = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const search = req.query.search || "";

  const query = {};

  // Check if search input is provided and build the query for searching by title
  if (search) {
    let isObjectId = false;
    try {
      isObjectId =
        ObjectId.isValid(search) && new ObjectId(search).toString() === search;
    } catch (e) {
      isObjectId = false;
    }
    query.$or = [{ title: { $regex: search, $options: "i" } }];
    if (isObjectId) {
      query.$or.push({ _id: new ObjectId(search) });
    }
  }

  const events = await Event.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Event.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  return res.status(200).json({
    success: true,
    events,
    page,
    totalPages,
    totalEvents: total,
  });
});

const getAllEvent = asyncHandler(async (req, res) => {
  const response = await Event.find();
  // console.log(response);
  return res.status(200).json({
    success: response ? true : false,
    events: response ? response : "fail to get all posts",
  });
});
const getEventByExpert = asyncHandler(async (req, res) => {
  const { _id } = req.user; // Lấy _id từ req.user
  const response = await Event.find({ userCreate: _id }); // Tìm sự kiện theo userCreate

  return res.status(200).json({
    success: response ? true : false,
    events: response ? response : "fail to get events for this user",
  });
});

const createEvent = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { timeStart, timeEnd, description, title } = req.body;

  if (!_id || !timeStart || !timeEnd || !description || !title) {
    return res.status(400).json({ success: false, message: "Missing input" });
  }

  // Validate that timeStart is before timeEnd
  if (new Date(timeStart) >= new Date(timeEnd)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid date range" });
  }

  // Generate dailyToDoLists based on timeStart and timeEnd
  const dailyToDoLists = [];
  const start = new Date(timeStart);
  const end = new Date(timeEnd);

  for (
    let date = new Date(start);
    date <= end;
    date.setDate(date.getDate() + 1)
  ) {
    dailyToDoLists.push({
      date: new Date(date), // Create a copy of the date
      tasks: [], // Initialize with an empty tasks array; tasks can be added later
    });
  }

  try {
    // Create a new event with the generated dailyToDoLists
    const response = await Event.create({
      userCreate: _id,
      timeStart,
      timeEnd,
      description,
      title,
      dailyToDoLists, // Add dailyToDoLists to the event
    });

    if (response) {
      // Update the user's idEvent array with the newly created event
      await User.findByIdAndUpdate(
        _id,
        { $push: { idEvent: response._id } },
        { new: true }
      );
    }

    return res.json({
      success: !!response,
      createEvent: response || "Cannot create new event",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

const getEvent = asyncHandler(async (req, res) => {
  const { eid } = req.params;

  // Validate that the eventId is provided
  if (!eid) {
    return res
      .status(400)
      .json({ success: false, message: "Missing event ID" });
  }

  try {
    // Find the event by its ID and populate related user data (if needed)
    const event = await Event.findById(eid).populate("userCreate participants");

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    return res.json({
      success: true,
      event,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});
const joinEvent = asyncHandler(async (req, res) => {
  const { eid } = req.params;
  const { _id } = req.user; // Assuming req.user contains the authenticated user's information

  // Validate the event ID
  if (!eid) {
    return res
      .status(400)
      .json({ success: false, message: "Missing event ID" });
  }

  try {
    // Find the event by its ID
    const event = await Event.findById(eid);

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    // Check if the user is already a participant
    if (event.participants.includes(_id)) {
      return res.status(400).json({
        success: false,
        message: "You are already a participant in this event",
      });
    }

    // Add the user to the participants array
    event.participants.push(_id);
    await event.save();

    // Update the user's events array
    await User.findByIdAndUpdate(
      _id,
      { $addToSet: { events: eid } }, // $addToSet ensures no duplicate values are added
      { new: true }
    );

    return res.json({
      success: true,
      message: "Successfully joined the event",
      event,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

const getUserJoinedEvents = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  try {
    const user = await User.findById(_id).populate("events");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.json({
      success: true,
      events: user.events,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

const updateTasksInTodoList = asyncHandler(async (req, res) => {
  const { eid } = req.params;
  const { date, tasks } = req.body;

  // Validate input
  if (!date || !Array.isArray(tasks)) {
    return res.status(400).json({ success: false, message: "Invalid input" });
  }

  try {
    // Fetch event by ID
    const event = await Event.findById(eid);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    // Find the todo list entry by date
    const todoListEntry = event.dailyToDoLists.find(
      (entry) =>
        entry.date.toISOString().split("T")[0] ===
        new Date(date).toISOString().split("T")[0]
    );

    if (!todoListEntry) {
      return res.status(404).json({
        success: false,
        message: "Todo list for the specified date not found",
      });
    }

    // Update tasks
    todoListEntry.tasks = tasks;

    // Save the updated event
    await event.save();

    return res.json({
      success: true,
      message: "Tasks updated successfully",
      dailyToDoLists: event.dailyToDoLists,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});
const updateTaskCompletionStatus = asyncHandler(async (req, res) => {
  const { eid } = req.params;
  const { date, taskId, isCompleted } = req.body;

  try {
    const event = await Event.findById(eid);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    const todoListEntry = event.dailyToDoLists.find(
      (entry) =>
        entry.date.toISOString().split("T")[0] ===
        new Date(date).toISOString().split("T")[0]
    );

    if (!todoListEntry) {
      return res
        .status(404)
        .json({ success: false, message: "Todo list not found" });
    }

    const task = todoListEntry.tasks.find((t) => t._id.toString() === taskId);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    // Cập nhật trạng thái cho participant
    task.participantStatus.set(req.user._id.toString(), isCompleted);

    await event.save();

    return res.json({
      success: true,
      message: "Task completion status updated successfully",
      dailyToDoLists: event.dailyToDoLists,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});
const addTaskToTodoList = asyncHandler(async (req, res) => {
  const { eid } = req.params; // Event ID
  const { date, task } = req.body; // Expecting date and task object in the request body

  // Validate input
  if (!date || !task || !task.description) {
    return res.status(400).json({ success: false, message: "Invalid input" });
  }

  try {
    // Find the event by its ID
    const event = await Event.findById(eid);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    // Find the dailyToDoLists entry for the specified date
    const todoListEntry = event.dailyToDoLists.find(
      (entry) =>
        entry.date.toISOString().split("T")[0] ===
        new Date(date).toISOString().split("T")[0]
    );

    if (!todoListEntry) {
      return res.status(404).json({
        success: false,
        message: "Todo list for the specified date not found",
      });
    }

    // Add the new task to the tasks array
    todoListEntry.tasks.push({
      date: new Date(date),
      description: task.description,
      isCompleted: task.isCompleted || false,
      participantStatus: new Map(), // Khởi tạo trạng thái cho từng participant
    });

    // Save the updated event
    await event.save();

    return res.json({
      success: true,
      message: "Task added successfully",
      dailyToDoLists: event.dailyToDoLists,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = {
  createEvent,
  updateEvent,
  deleteEvent,
  getEvent,
  getEvents,
  getAllEvent,
  joinEvent,
  getUserJoinedEvents,
  updateTasksInTodoList,
  updateTaskCompletionStatus,
  addTaskToTodoList,
  getEventByExpert,
};
