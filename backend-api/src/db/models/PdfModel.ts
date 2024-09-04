import mongoose from "mongoose";

interface IPdf extends Document {
  name: string;
  data: Buffer;
  contentType: string;
  course: string;
  index: number;
  description: string;
}

const pdfSchema = new mongoose.Schema({
  name: { type: String, required: true },
  downloadURL: { type: String, required: true },
  storagePath: { type: String, required: true },
  contentType: { type: String, required: true },
  course: { type: String, required: true },
  index: { type: Number, required: true },
  description: { type: String, required: true },
});

export const PdfModel = mongoose.model<IPdf>("Pdf", pdfSchema);
