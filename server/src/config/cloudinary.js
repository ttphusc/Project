const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

// Cấu hình storage
const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ['jpg', 'png', 'jpeg'],
  params: {
    folder: 'fitnutritionhub'
  }
});

// Cấu hình upload middleware
const uploadCloud = multer({ storage });

module.exports = uploadCloud; 