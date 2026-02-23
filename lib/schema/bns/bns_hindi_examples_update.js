import mongoose from "mongoose";

const BnsHindiExamplesUpdateSchema = new mongoose.Schema({
  last_update_at: {
    type: Date,
    default: Date.now,
    index: true,
  },
  isMobile_app_updated:{
    type: Boolean,
    default: true
  },
}, { timestamps: true });

export default mongoose.models.BnsHindiExamplesUpdate 
  || mongoose.model(
    "BnsHindiExamplesUpdate",
    BnsHindiExamplesUpdateSchema,
    "bns_hindi_examples_update"
  );
