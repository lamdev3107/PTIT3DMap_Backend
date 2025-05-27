import { Router } from "express";

const router = Router();

import multer from "multer";
import upload from "../utils/localUpload";

router.post("/tour-360", upload.single("tour360"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Không tìm thấy file",
      });
    }
    const uploadDir = path.join(__dirname, "../uploads");

    // Tạo thư mục uploads nếu chưa tồn tại
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Lưu file vào thư mục uploads
    const filePath = path.join(uploadDir, req.file.originalname);
    fs.writeFileSync(filePath, JSON.stringify(req.file));

    return res.status(200).json({
      success: true,
      message: "Upload file thành công",
      data: {
        filename: req.file.originalname,
        path: filePath,
      },
    });
  } catch (error) {
    console.error("Lỗi khi upload file:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi khi upload file",
      error: error.message,
    });
  }
});

export default router;
