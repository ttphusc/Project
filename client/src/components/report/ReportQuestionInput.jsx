import React, { useState } from "react";
import ReportIcon from '@mui/icons-material/Report';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import BlockIcon from '@mui/icons-material/Block';
import SecurityIcon from '@mui/icons-material/Security';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';

const ReportQuestionInput = ({ onClose, onSelectReason }) => {
  const [selectedReason, setSelectedReason] = useState(null);

  const reportOptions = [
    {
      id: 1,
      reason: "Inaccurate or misleading information",
      icon: <ErrorOutlineIcon className="text-red-500" />,
      description: "Question contains false or misleading health/fitness information"
    },
    {
      id: 2,
      reason: "Encouraging dangerous activities",
      icon: <WarningAmberIcon className="text-orange-500" />,
      description: "Promotes unsafe exercise techniques or dangerous practices"
    },
    {
      id: 3,
      reason: "Abusive or harassing content",
      icon: <BlockIcon className="text-purple-500" />,
      description: "Contains harassment, hate speech, or inappropriate content"
    },
    {
      id: 4,
      reason: "Promotion of unsafe products or methods",
      icon: <SecurityIcon className="text-blue-500" />,
      description: "Promotes harmful supplements or dangerous health practices"
    },
    {
      id: 5,
      reason: "Scam or fraud",
      icon: <MoneyOffIcon className="text-green-500" />,
      description: "Suspicious activities or fraudulent content"
    },
  ];

  const handleReasonSelect = (reason) => {
    setSelectedReason(reason);
    onSelectReason(reason);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div className="bg-white w-[734px] rounded-2xl shadow-lg transform transition-all max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ReportIcon className="w-8 h-8 text-red-500" />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Report Question
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Help us maintain a safe and accurate knowledge base
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <CloseIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Warning Notice */}
          <div className="flex items-start gap-4 bg-yellow-50 p-4 rounded-lg mb-6">
            <WarningAmberIcon className="text-yellow-600 w-6 h-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-yellow-800 font-medium mb-1">Please Note</h3>
              <p className="text-yellow-600 text-sm">
                False reports may result in action being taken against your account. 
                Please ensure your report is accurate and follows our community guidelines.
              </p>
            </div>
          </div>

          {/* Report Options */}
          <div className="space-y-4">
            {reportOptions.map((option) => (
              <div
                key={option.id}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md
                  ${selectedReason === option.reason
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                onClick={() => handleReasonSelect(option.reason)}
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white rounded-full shadow-sm flex-shrink-0">
                    {option.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {option.reason}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {option.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-center w-6 h-6 flex-shrink-0">
                    <div
                      className={`w-4 h-4 rounded-full border-2 transition-all
                        ${selectedReason === option.reason
                          ? 'border-red-500 bg-red-500'
                          : 'border-gray-300'
                        }`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => selectedReason && onSelectReason(selectedReason)}
              disabled={!selectedReason}
              className={`px-6 py-2 rounded-lg transition-all duration-200
                ${selectedReason
                  ? 'bg-red-500 text-white hover:bg-red-600 transform hover:-translate-y-0.5'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
            >
              Submit Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportQuestionInput;
