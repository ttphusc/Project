const { spawn } = require("child_process");
const path = require("path");
const Report = require("../models/report");
const Post = require("../models/post");
const Notification = require("../models/notification");
const mongoose = require("mongoose");
const { getIO } = require("../config/socket");

const SYSTEM_ID = new mongoose.Types.ObjectId("676e3afb99332af921f47c5c");

const handleAutomaticModeration = async (req, res) => {
  try {
    const { reportId } = req.params;
    const report = await Report.findById(reportId)
      .populate({
        path: "idPost",
      })
      .populate("idUser");

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    const pythonProcess = spawn("./venv/bin/python3", [
      path.join(__dirname, "../ai/moderation.py"),
      JSON.stringify({
        content: report.idPost.content,
        reason_report: report.reasonReport,
      }),
    ]);

    let result = "";
    pythonProcess.stdout.on("data", (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error("Python Error:", data.toString());
    });

    pythonProcess.on("close", async (code) => {
      if (code !== 0) {
        return res.status(500).json({
          success: false,
          message: "AI processing failed",
        });
      }

      const aiResult = JSON.parse(result);

      if (aiResult.is_violation) {
        await Post.findByIdAndUpdate(report.idPost._id, {
          state: "banned",
          isBlocked: true,
        });
        const notification = await Notification.create({
          senderId: SYSTEM_ID,
          receiverId: report.idPost.idAuthor,
          message: `Your post has been removed due to a violation: ${
            aiResult.reason
          }. Violating keywords: ${aiResult.detected_keywords.join(
            ", "
          )}. Please contact us at adminitnutritionhub@gmail.com to unblock the post.`,
          messageCount: 1,
          isRead: false,
        });

        const notifications = await Notification.find({
          receiverId: report.idPost.idAuthor,
          isRead: false,
        })
          .populate("senderId", "firstname avatar")
          .sort({ createdAt: -1 });

        const io = getIO();
        if (io) {
          io.emit("send_notification", {
            receiverId: report.idPost.idAuthor,
            notifications: notifications,
          });
        }

        await Report.findByIdAndUpdate(reportId, {
          status: "resolved",
          aiVerdict: aiResult,
        });
      }

      res.json({
        success: true,
        result: aiResult,
      });
    });
  } catch (error) {
    console.error("Auto moderation error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { handleAutomaticModeration };
