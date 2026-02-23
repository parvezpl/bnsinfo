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
    });
    return;
  }

  await BnsHindiExamplesUpdate.updateOne(
    { _id: existing._id },
    {
      $set: { last_update_at: new Date() },
    }
  );
}

export default async function handler(req, res) {
  await connectDB();
  const route = req.query?.route || req.body?.route || req.body?.action;

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
      if (route === "recordHindiExampleUpdate") {
        const { section } = req.body || {};
        if (!section || typeof section !== "string") {
          return res.status(400).json({ error: "section is required" });
        }

        await recordHindiExampleUpdate(section);
        return res.status(200).json({ message: "Update recorded", section });
      }

      const { section, section_content, example_content } = req.body || {};
      if (!section || !section_content) {
        return res.status(400).json({ error: "section and section_content are required" });
      }

      const data = await BnsHindiExample.create({
        section,
        section_content,
        example_content: example_content ?? "",
        user: req.body.user || null,
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
      if (typeof req.body.user === "object") update.user = req.body.user;


      const updated = await BnsHindiExample.findByIdAndUpdate(id, update, { new: true });
      if (!updated) return res.status(404).json({ error: "Not found" });
      await recordHindiExampleUpdate(updated.section);

      return res.status(200).json({ message: "Updated", data: updated });
    } catch (error) {
      return res.status(500).json({ error: "Failed to update section" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: "id is required" });
      }

      const deleted = await BnsHindiExample.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ error: "Not found" });
      }

      // record update for mobile sync
      await recordHindiExampleUpdate(deleted.section);

      return res.status(200).json({ message: "Deleted", data: deleted });
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete section" });
    }
  }


  res.setHeader("Allow", ["GET", "POST", "PUT", "PATCH", "DELETE"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
