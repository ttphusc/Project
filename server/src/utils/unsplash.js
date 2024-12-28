const axios = require("axios");

require("dotenv").config();
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY; // Đảm bảo bạn đã thiết lập biến môi trường này

const fetchHealthImages = async (query = "Food & Drink") => {
  const url = `https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=5`; // Thêm per_page=5 để lấy 5 hình ảnh

  try {
    const response = await axios.get(url);
    return response.data.results.map((image) => image.urls.small); // Trả về URL của hình ảnh
  } catch (error) {
    console.error("Error fetching images from Unsplash:", error);
    throw error;
  }
};

module.exports = { fetchHealthImages };
