import { format, formatDistanceToNow } from "date-fns";

export const formatTimeCreate = (date) => {
  if (!date) {
    return "Invalid date";
  }

  const createdAt = new Date(date);

  // Kiểm tra giá trị thời gian hợp lệ
  if (isNaN(createdAt.getTime())) {
    return "Invalid date";
  }

  const now = new Date();
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(now.getDate() - 7);

  if (createdAt < oneWeekAgo) {
    return format(createdAt, "dd/MM/yyyy"); // Adjust the format as needed
  }
  return formatDistanceToNow(createdAt, { addSuffix: true });
};
