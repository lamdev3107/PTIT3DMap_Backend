import cloudinary from "../config/cloudinary.config";
import { convertFormData } from "../utils/helpers";
import db from "../models";



const createNewScene = async (req, res, next) => {
  const { body, files } = req;

  try {
    const scenes = [];
    const groupedFiles = {};
    files.forEach(file => {
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
            roomId: item.roomId,
            title: item.title,
            panorama: panorama || null
          });
        });
      }
    
    }
    const newScenes = await db.Scene.bulkCreate(scenes);

    console.log("✅ Scenes result:", scenes);


    // Gửi phản hồi về cho client
    res.status(200).json({ success: true, data: newScenes });
  } catch (error) {
    next(error);
  }
};





export {
    createNewScene
}