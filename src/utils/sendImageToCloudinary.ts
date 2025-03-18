/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import path from "path";
import fs from "fs";
import config from "../config";

// Configuration
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

export const sendImageToCloudinary = (
  imageName: string,
  filePath: string
): Promise<{ [key: string]: any }> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload(filePath, {
        public_id: imageName,
      })
      .then((uploadResult) => {
        console.log(uploadResult);

        // Optimize delivery
        const optimizeUrl = cloudinary.url(imageName, {
          fetch_format: "auto",
          quality: "auto",
        });

        console.log(optimizeUrl);

        // Transform the image
        const autoCropUrl = cloudinary.url(imageName, {
          crop: "auto",
          gravity: "auto",
          width: 500,
          height: 500,
        });

        console.log(autoCropUrl);

        resolve(uploadResult);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("file is deleted");
          }
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// Upload directory setup
const uploadDir = path.join(process.cwd(), "uploads/");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

export const upload = multer({ storage });
