import { connectDB } from "../../../lib/db";
import BnsHindiExample from "../../../lib/schema/bns/hindi_examples";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    try {
      const items = await BnsHindiExample.find({}).sort({ createdAt: -1 });
      return res.status(200).json({ data: items });
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch sections" });
    }
  }

  if (req.method === "POST") {
    try {
      const { section, section_content, example_content } = req.body || {};

      if (!section || !section_content || !example_content) {
        return res.status(400).json({ error: "section, section_content, example_content are required" });
      }

      const data = await BnsHindiExample.create({
        section,
        section_content,
        example_content,
      });

      return res.status(201).json({ message: "Created", data });
    } catch (error) {
      return res.status(500).json({ error: "Failed to create section" });
    }
  }

  if (req.method === "PUT" || req.method === "PATCH") {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: "id is required" });
      }
      const { section, section_content, example_content } = req.body || {};
      const update = {};
      if (typeof section === "string") update.section = section;
      if (typeof section_content === "string") update.section_content = section_content;
      if (typeof example_content === "string") update.example_content = example_content;

      const updated = await BnsHindiExample.findByIdAndUpdate(id, update, { new: true });
      if (!updated) return res.status(404).json({ error: "Not found" });
      return res.status(200).json({ message: "Updated", data: updated });
    } catch (error) {
      return res.status(500).json({ error: "Failed to update section" });
    }
  }

  res.setHeader("Allow", ["GET", "POST", "PUT", "PATCH"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
