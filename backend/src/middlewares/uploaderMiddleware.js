import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "~/config/cloudinartConfig";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  allowed_formats: ["jpg", "png"],
  params: {
    folder: "grocery_store",
  },
});

const uploader = multer({ storage });

module.exports = uploader;
