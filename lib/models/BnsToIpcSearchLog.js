import mongoose from "mongoose";

const BnsToIpcSearchLogSchema = new mongoose.Schema(
  {
    app: { type: String, default: "BnsToIpc", trim: true, index: true },
    sentAt: { type: Date, default: null },
    itemId: { type: String, default: "", trim: true, index: true },
    query: { type: String, required: true, trim: true, index: true },
    bns: { type: String, default: "", trim: true },
    ipc: { type: String, default: "", trim: true },
    isBns: { type: Boolean, default: false, index: true },
    source: { type: String, default: "home_search", trim: true, index: true },
    clientCreatedAt: { type: Date, default: null, index: true },
    rawItem: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, collection: "bnstoipc_search_logs" }
);

export default mongoose.models.BnsToIpcSearchLog ||
  mongoose.model("BnsToIpcSearchLog", BnsToIpcSearchLogSchema);

