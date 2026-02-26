import { connectDB } from "../../../../lib/db";
import Bnshi from "../../../../lib/schema/bnshi";

export async function getBnsData() {
  await connectDB();
  const bns = await Bnshi.find({}, { _id: 1, sections: 1 }).lean();
  return { bns };
}
