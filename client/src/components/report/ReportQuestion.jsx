import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ReportIcon from "@mui/icons-material/Report";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const ReportQuestion = ({ reason, onClose }) => {
  const { qid } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const reportQuestion = async () => {
    if (!reason) {
      toast.error("Please select a reason for reporting");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Please login to report questions");
        return;
      }

      if (!qid) {
        toast.error("Question ID not found");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/report/question/${qid}`,
        {
          reasonReport: reason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000); // Tự động đóng sau 2 giây
      } else {
        toast.error("Failed to submit report");
      }
    } catch (error) {
      toast.error("Error submitting report");
      console.error("Error submitting report:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
        <div className="bg-white w-[400px] rounded-2xl shadow-lg p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Report Submitted
            </h2>
            <p className="text-gray-600">
              Thank you for your report. Our team will review it shortly.
            </p>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2 }}
              className="h-1 bg-green-500 rounded-full mt-4"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div className="bg-white w-[800px] rounded-2xl shadow-lg transform transition-all max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-full">
                <ReportIcon className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Confirm Report
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Review your report details before submitting
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              disabled={isSubmitting}
            >
              <CloseIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[60vh]">
          {/* Warning Notice */}
          <div className="flex items-start gap-4 bg-yellow-50 p-4 rounded-lg mb-6">
            <WarningAmberIcon className="text-yellow-600 w-6 h-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-yellow-800 font-medium mb-1">
                Important Notice
              </h3>
              <p className="text-yellow-600 text-sm">
                False reports may result in action being taken against your
                account. Please ensure your report is accurate and follows our
                community guidelines.
              </p>
            </div>
          </div>

          {/* Report Details */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <ReportIcon className="w-5 h-5 text-gray-600" />
              Report Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Reason for Report
                </label>
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-800">
                    {reason || "No reason selected"}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Question ID
                </label>
                <div className="p-4 bg-white rounded-lg border border-gray-200 font-mono">
                  <p className="text-gray-800">{qid}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-6 text-sm text-gray-500">
            <p>
              Our team will review your report and take appropriate action if
              necessary. You may be contacted for additional information.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={reportQuestion}
              disabled={!reason || isSubmitting}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all duration-200 font-medium
                ${
                  !reason || isSubmitting
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-red-500 text-white hover:bg-red-600 transform hover:-translate-y-0.5"
                }`}
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={20} color="inherit" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <SendIcon className="w-5 h-5" />
                  <span>Submit Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportQuestion;
