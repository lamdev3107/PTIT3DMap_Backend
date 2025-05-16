import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.config";

// const storage = multer.diskStorage({
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// Configure CloudinaryStorage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  allowedFormats: ["jpg", "png", "glb", "gltf"],
  params: async (req, file) => {
    const folderName = req.body.folder || "PTIT3DMap"; // ✅ Lấy folder từ request
    return {
      folder: folderName,
      // resource_type: "raw", // Cho phép upload file raw như .glb
      // public_id: file.originalname.split(".")[0], // Optional: Đặt tên file
    };
  },
});

const upload = multer({ storage });

export default upload;
