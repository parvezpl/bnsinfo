import mongoose from "mongoose";


const BnsHindiExampleSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    unique: true,   // ✅ correct
    index: true     // ⚡ recommended for fast search
  },
  section_content: {
    type: String,
    required: true,
  },
  example_content: {
    type: String,
    required: false,
    trim: true
  },
  update_section_id: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

export default mongoose.models.BnsHindiExample || mongoose.model("BnsHindiExample", BnsHindiExampleSchema, "bns_hindi_examples");
