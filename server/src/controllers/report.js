const Report = require("../models/report");
const post = require("../models/post");
const User = require("../models/user");

const asyncHandler = require("express-async-handler");

const createPostReport = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { reasonReport } = req.body;
  const { pid } = req.params;

  if (!pid || !reasonReport || !_id) throw new Error("Missing input");

  const response = await Report.create({
    reasonReport,
    idPost: pid,
    idUser: _id,
  });

  return res.json({
    success: response ? true : false,
    createReport: response ? response : "Cannot create new report",
  });
});

const createQuestionReport = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { reasonReport } = req.body;
  const { qid } = req.params;

  if (!qid || !reasonReport || !_id) throw new Error("Missing input");

  const response = await Report.create({
    reasonReport,
    idQuestion: qid,
    idUser: _id,
  });

  return res.json({
    success: response ? true : false,
    createReport: response ? response : "Cannot create new report",
  });
});

const getReport = asyncHandler(async (req, res) => {
  const { rid } = req.params;
  const report = await Report.findById(rid);

  return res.json({
    success: report ? true : false,
    rs: report,
  });
});

const deleteReport = asyncHandler(async (req, res) => {
  const { rid } = req.params;
  const report = await Report.findByIdAndDelete(rid);

  return res.json({
    success: report ? true : false,
    deletedReport: report ? report : "cannot delete report",
  });
});

const getReports = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const status = req.query.status;
  const type = req.query.type; // 'post' hoặc 'question'
  const search = req.query.search || "";

  const query = {
    ...(status && { status }), // Thêm điều kiện lọc theo status nếu có
  };

  // Thêm điều kiện lọc theo type
  if (type === "post") {
    query.idPost = { $exists: true, $ne: null };
  } else if (type === "question") {
    query.idQuestion = { $exists: true, $ne: null };
  }

  // Xử lý tìm kiếm nếu có
  if (search) {
    let isObjectId = false;
    try {
      isObjectId =
        ObjectId.isValid(search) && new ObjectId(search).toString() === search;
    } catch (e) {
      isObjectId = false;
    }

    query.$or = [{ reasonReport: { $regex: search, $options: "i" } }];
    if (isObjectId) {
      query.$or.push({ _id: new ObjectId(search) });
    }
  }

  console.log("Query for type filter:", query); // Log để kiểm tra query được tạo ra

  try {
    // Lấy dữ liệu báo cáo từ cơ sở dữ liệu với phân trang và sắp xếp
    const reports = await Report.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Đếm tổng số lượng báo cáo phù hợp với điều kiện lọc
    const total = await Report.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      reports,
      page,
      totalPages,
      totalReports: total,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch reports. Please try again later.",
    });
  }
});

const updateStatus = asyncHandler(async (req, res) => {
  const { rid } = req.params;
  const { status } = req.body;
  console.log(status);
  console.log(rid);
  if (!status || !rid) throw new Error("Missing input");
  const response = await Report.findByIdAndUpdate(
    rid,
    { status },
    { new: true }
  );
  return res.status(200).json({
    success: response ? true : false,
    message: response ? response : "false to update status",
  });
});

const getAllReport = asyncHandler(async (req, res) => {
  const response = await Report.find();
  return res.status(200).json({
    success: response ? true : false,
    report: response ? response : "fail to get all report",
  });
});
//report user
module.exports = {
  getReports,
  createPostReport,
  createQuestionReport,
  getReport,
  deleteReport,
  updateStatus,
  getAllReport,
};
