import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import initRoutes from "./src/routes";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import connectDatabase from "./src/config/database.config";
import multer from 'multer';

const app = express();

//config cookie-parser
app.use(cookieParser());

// Configure multer for handling form-data/multipart uploads
// const upload = multer();
// app.use(upload.any());

//config body-parser for JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    //Chan tat ca cac domain khac ngoai domain nay
    origin: process.env.CLIENT_URL,
    //Production domain
    // origin: "https://sfotipy-frontend.vercel.app",
    credentials: true, //Để bật cookie HTTP qua CORS
  })
);
initRoutes(app);
connectDatabase();

const port = process.env.PORT || 8888;
const hostname = process.env.HOSTNAME;
const listener = app.listen(port, () => {
  console.log(`Server is running on  ${hostname}:${listener.address().port}`);
});
