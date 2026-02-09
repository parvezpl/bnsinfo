import mongoose from "mongoose";

const BnsHindiExampleSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
  },
  section_content: {
    type: String,
    required: true,
  },
  example_content: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export default mongoose.models.BnsHindiExample || mongoose.model("BnsHindiExample", BnsHindiExampleSchema, "bns_hindi_examples");
