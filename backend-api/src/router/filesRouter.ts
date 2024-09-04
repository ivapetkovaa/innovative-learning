import express from "express";
import { isAuthenticated, isAdmin } from "../middlewares";
import {
  downloadResource,
  getFilesForCourse,
  uploadPdfFile,
  deleteFile,
  getAllFiles,
} from "../controllers/filesController";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

export default (router: express.Router) => {
  router.post("/upload", upload.single("file"), uploadPdfFile);

  router.delete("/deleteFile/:fileId", deleteFile);
  router.get(
    "/getFiles/:courseId",

    getFilesForCourse
  );
  router.get("/getAllFiles", isAuthenticated, isAdmin, getAllFiles);
  router.get("/download/:id", isAuthenticated, downloadResource);
};
