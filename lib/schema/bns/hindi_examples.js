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
    default: "",
  },
  update_section_id: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

const BnsHindiExamplesUpdateSchema = new mongoose.Schema({
  last_update_at: {
    type: Date,
    default: Date.now,
    index: true,
  },
  update_section: [
    {
      section: {
        type: String,
        required: true,
      },
      updated_at: {
        type: Date,
        default: Date.now,
      },
    }
  ]
}, { timestamps: true });

const BnsHindiExamplesUpdate =
  mongoose.models.BnsHindiExamplesUpdate
  || mongoose.model(
    "BnsHindiExamplesUpdate",
    BnsHindiExamplesUpdateSchema,
    "bns_hindi_examples_update"
  );

const BnsHindiExample =
  mongoose.models.BnsHindiExample
  || mongoose.model("BnsHindiExample", BnsHindiExampleSchema, "bns_hindi_examples");

export { BnsHindiExamplesUpdate };
export default BnsHindiExample;
