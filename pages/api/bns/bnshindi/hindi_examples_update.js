import { connectDB } from "../../../../lib/db";
import BnsHindiExamplesUpdate from "../../../../lib/schema/bns/bns_hindi_examples_update";

function parseDateInput(value) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    try {
      let doc = await BnsHindiExamplesUpdate.findOne({});
      if (!doc) {
        doc = await BnsHindiExamplesUpdate.create({
          last_update_at: new Date(),
          isMobile_app_updated: true,
          update_section: [],
        });
      }
      return res.status(200).json({ data: doc });
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch update status" });
    }
  }

  if (req.method === "POST") {
    try {
      const { last_update_at, updated_at } = req.body || {};
      const dateInput = parseDateInput(last_update_at) || parseDateInput(updated_at) || new Date();

      const doc = await BnsHindiExamplesUpdate.findOneAndUpdate(
        {},
        {
          $set: {
            last_update_at: dateInput,
            isMobile_app_updated: true,
            update_section: [],
          },
        },
        { new: true, upsert: true }
      );

      return res.status(200).json({ message: "Updated", data: doc });
    } catch (error) {
      return res.status(500).json({ error: "Failed to update status" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
