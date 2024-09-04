import express from "express";

import { PdfModel } from "../db/models/PdfModel";
import { firebaseConfig } from "../db/firebase/config";
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";

import { giveCurrentDateTime } from "../utils/index";

initializeApp(firebaseConfig);

const storage = getStorage();

export const getAllFiles = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const files = await PdfModel.find();

    // Return an empty array if no files are found
    res.status(200).json(files);
  } catch (err) {
    console.error("Error retrieving files:", err);
    res.status(500).json({ error: "Error retrieving files." });
  }
};

export const uploadPdfFile = async (
  req: express.Request,
  res: express.Response
) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const currentDate = giveCurrentDateTime();
  const path = `files/${req.file.originalname + "    " + currentDate}`;
  const storageRef = ref(storage, path);

  const metadata = {
    contentType: req.file.mimetype,
  };

  const snapshot = await uploadBytesResumable(
    storageRef,
    req.file.buffer,
    metadata
  );

  const downloadUrl = await getDownloadURL(snapshot.ref);

  const newPdf = new PdfModel({
    name: req.file.originalname,
    downloadURL: downloadUrl,
    storagePath: path,
    contentType: req.file.mimetype,
    course: req.body.course,
    index: Number(req.body.index),
    description: req.body.description,
  });

  try {
    await newPdf.save();
    res.status(201).send("File uploaded successfully.");
  } catch (err) {
    console.error("Error uploading file:", err);
    res.status(500).send("Error uploading file.");
  }
};

export const getFilesForCourse = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const courseId = req.params.courseId;

    if (!courseId) {
      return res.status(400).send("Course ID is required.");
    }

    const files = await PdfModel.find({ course: courseId }).sort({ index: 1 });

    if (!files.length) {
      return res.status(404).send("No files found for this course.");
    }

    res.status(200).json(files);
  } catch (err) {
    console.error("Error retrieving files:", err);
    res.status(500).send("Server error. Could not retrieve files.");
  }
};
export const downloadResource = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const file = (await PdfModel.findById(req.params.id)) as any;
    if (!file) {
      return res.status(404).send("File not found");
    }
    res.set("Content-Type", file.contentType);
    res.set("Content-Disposition", `attachment; filename="${file.name}"`);
    res.send(file?.downloadURL);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const deleteFile = async (
  req: express.Request,
  res: express.Response
) => {
  const { fileId } = req.params;

  try {
    const result = (await PdfModel.findOne({ _id: fileId })) as any;

    if (!result) {
      return res.status(404).send("File not found.");
    }

    // Ensure 'storagePath' exists and is correctly stored in the model
    if (!result.storagePath) {
      return res.status(400).send("File storage path not found in record.");
    }

    const fileRef = ref(storage, result.storagePath);

    try {
      await deleteObject(fileRef);
    } catch (firebaseError) {
      console.error(
        "Error deleting file from Firebase Storage:",
        firebaseError
      );
      return res.status(500).send("Error deleting file from storage.");
    }

    const item = await PdfModel.findOneAndDelete({ _id: fileId });

    if (item) {
      return res.sendStatus(200);
    } else {
      res.status(500).send("Error deleting file.");
    }
  } catch (err) {
    console.error("Error deleting file:", err);
    return res.status(500).send("Error deleting file.");
  }
};
