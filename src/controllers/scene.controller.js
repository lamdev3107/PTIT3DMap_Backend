import cloudinary from "../config/cloudinary.config";
import { convertFormData } from "../utils/helpers";
import db from "../models";

const createNewScene = async (req, res, next) => {
  const { body, files } = req;

  try {
    const scenes = [];
    const groupedFiles = {};
    files.forEach((file) => {
      const match = file.fieldname.match(/scenes\[(\d+)\]\[panorama\]/);
      if (match) {
        const index = match[1];
        groupedFiles[index] = file;
      }
    });
    // Upload files to cloudinary
    const uploadedFiles = {};
    for (const [index, file] of Object.entries(groupedFiles)) {
      try {
        // Dùng upload_stream thay vì upload với file.buffer
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
              if (error) {
                return reject(error);
              }
              resolve(result);
            }
          );

          // Gửi buffer vào stream
          stream.end(file.buffer);
        });

        uploadedFiles[index] = result.secure_url;
      } catch (error) {
        console.error(`Error uploading file at index ${index}:`, error);
      }
    }
    // Kiểm tra mảng scenes trong body
    const newbody = JSON.parse(JSON.stringify(req.body));
    for (const [key, value] of Object.entries(newbody)) {
      if (key === "scenes") {
        value.map((item, index) => {
          const panorama = uploadedFiles[index] || null;
          scenes.push({
            floorId: item.floorId,
            title: item.title,
            panorama: panorama || null,
          });
        });
      }
    }
    const newScenes = await db.Scene.bulkCreate(scenes);

    // Gửi phản hồi về cho client
    res.status(200).json({ success: true, data: newScenes });
  } catch (error) {
    next(error);
  }
};

const deleteScene = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Tìm scene cần xóa
    const scene = await db.Scene.findByPk(id);
    if (!scene) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy scene",
      });
    }

    // Nếu scene có panorama, xóa file trên cloudinary
    if (scene.panorama) {
      const publicId = scene.panorama.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    // Xóa scene từ database
    await scene.destroy();

    res.status(200).json({
      success: true,
      message: "Xóa scene thành công",
    });
  } catch (error) {
    next(error);
  }
};

const updateScene = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body, files } = req;

    // Tìm scene cần cập nhật
    const scene = await db.Scene.findByPk(id);
    if (!scene) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy scene",
      });
    }

    // Nếu có file panorama mới
    if (files && files.length > 0) {
      const file = files[0];

      // Xóa file cũ trên cloudinary nếu có
      if (scene.panorama) {
        const publicId = scene.panorama.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      // Upload file mới lên cloudinary
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "auto" },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          }
        );
        stream.end(file.buffer);
      });

      // Cập nhật URL panorama mới
      body.panorama = result.secure_url;
    }

    // Cập nhật thông tin scene
    await scene.update(body);

    res.status(200).json({
      success: true,
      data: scene,
      message: "Cập nhật scene thành công",
    });
  } catch (error) {
    next(error);
  }
};

const getScene = async (req, res, next) => {
  try {
    const { id } = req.params;

    const scene = await db.Scene.findByPk(id);
    if (!scene) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy scene",
      });
    }

    res.status(200).json({
      success: true,
      data: scene,
    });
  } catch (error) {
    next(error);
  }
};

export { createNewScene, deleteScene, updateScene, getScene };
