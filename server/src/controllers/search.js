const Post = require("../models/post");
const Question = require("../models/question");
const Event = require("../models/event");
const asyncHandler = require("express-async-handler");

const search = asyncHandler(async (req, res) => {
  const { title } = req.query;
  if (!title) throw new Error("Missing input");

  // Fetch posts, questions, and events matching the search query
  const posts = await Post.find({
    title: { $regex: title, $options: "i" },
  }).lean();
  const questions = await Question.find({
    title: { $regex: title, $options: "i" },
  }).lean();
  const events = await Event.find({
    title: { $regex: title, $options: "i" },
  }).lean();

  // Add 'type' field to each result
  const postsWithType = posts.map((post) => ({ ...post, type: "post" }));
  const questionsWithType = questions.map((question) => ({
    ...question,
    type: "question",
  }));
  const eventsWithType = events.map((event) => ({ ...event, type: "event" }));

  // Combine all results into a single array
  const combinedResults = [
    ...postsWithType,
    ...questionsWithType,
    ...eventsWithType,
  ];

  return res.json({
    success: true,
    results: combinedResults, // Return combined results with type
  });
});

module.exports = { search };
