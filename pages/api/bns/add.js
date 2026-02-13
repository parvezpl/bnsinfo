import { connectDB } from "../../../lib/db";
import BnsHindiExamplesUpdate from "../../../lib/schema/bns/bns_hindi_examples_update";
import BnsHindiExample from "../../../lib/schema/bns/hindi_examples";

async function recordHindiExampleUpdate(section) {
  if (!section || typeof section !== "string") return;

  const updateItem = { section, updated_at: new Date() };
  const existing = await BnsHindiExamplesUpdate.findOne({});

  if (!existing) {
    await BnsHindiExamplesUpdate.create({
      last_update_at: new Date(),
      isMobile_app_updated: false,
      update_section: [updateItem],
    });
    return;
  }

  if (existing.isMobile_app_updated) {
    await BnsHindiExamplesUpdate.updateOne(
      { _id: existing._id },
      {
        $set: {
          last_update_at: new Date(),
          isMobile_app_updated: false,
          update_section: [updateItem],
        },
      }
    );
    return;
  }

  await BnsHindiExamplesUpdate.updateOne(
    { _id: existing._id },
    {
      $set: { last_update_at: new Date() },
      $push: { update_section: updateItem },
    }
  );
}

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

      if (!section || !section_content ) {
        return res.status(400).json({ error: "section, section_content, example_content are required" });
      }

      const data = await BnsHindiExample.create({
        section,
        section_content,
        example_content,
      });

      await recordHindiExampleUpdate(section);


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
      await recordHindiExampleUpdate(updated.section);
      
      return res.status(200).json({ message: "Updated", data: updated });
    } catch (error) {
      return res.status(500).json({ error: "Failed to update section" });
    }
  }

  res.setHeader("Allow", ["GET", "POST", "PUT", "PATCH"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
