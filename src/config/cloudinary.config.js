import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
cloudinary.config({
  // cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  // api_key: process.env.CLOUDINARY_API_KEY,
  // api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: "dvpbg6p52",
  api_key: "147137311699264",
  api_secret: "KawhvnhNueHSTqGr6MVUbC1F3O4",
});
export default cloudinary;
