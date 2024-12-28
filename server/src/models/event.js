const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var eventSchema = new mongoose.Schema(
  {
    userCreate: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    timeStart: {
      type: Date,
      required: true,
    },
    timeEnd: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
    },
    title: {
      type: String,
    },
    participants: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      default: "active",
      enum: ["active", "deactive"],
    },
    dailyToDoLists: [
      {
        date: { type: Date, required: true },
        tasks: [
          {
            idParticipate: {
              type: mongoose.Types.ObjectId,
              ref: "User",
            },
            date: { type: Date, required: true },
            description: { type: String, required: true },
            isCompleted: { type: Boolean, default: false },
            participantStatus: {
              type: Map,
              of: Boolean,
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

eventSchema.pre("save", function (next) {
  const event = this;
  if (
    event.isNew ||
    event.isModified("timeStart") ||
    event.isModified("timeEnd")
  ) {
    const start = new Date(event.timeStart);
    const end = new Date(event.timeEnd);
    event.dailyToDoLists = [];

    for (
      let date = new Date(start);
      date <= end;
      date.setDate(date.getDate() + 1)
    ) {
      // Use a new Date instance to avoid reference issues
      event.dailyToDoLists.push({
        date: new Date(date),
        tasks: [], // Initialize with empty tasks array
      });
    }
  }
  next();
});

eventSchema.pre("find", async function (next) {
  // Update events where the `timeEnd` has passed and the status is still "active"
  await mongoose
    .model("Event")
    .updateMany(
      { timeEnd: { $lte: new Date() }, status: "active" },
      { status: "deactive" }
    );
  next();
});

eventSchema.pre("findOne", async function (next) {
  // Update a single event if `timeEnd` has passed and the status is still "active"
  await mongoose
    .model("Event")
    .updateOne(
      { timeEnd: { $lte: new Date() }, status: "active" },
      { status: "deactive" }
    );
  next();
});

// Export the model
module.exports = mongoose.model("Event", eventSchema);
