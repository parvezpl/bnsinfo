
import { connectDB } from "../../../../lib/db";
import Sectionhindi from "../../../../lib/schema/bns/hindisections";



export default async function handler(req, res) {
    await connectDB()

    if (req.method == "GET") {
        console.log("hello")
        const sections = await Sectionhindi.find()
        // console.log(sections)
        return res.status(200).json({ sections });
    }

    if (req.method === 'POST') {
        const {section, section_content} =req.body
        console.log(section, section_content)
        const newSection = await Sectionhindi.create({
            section:section,
            section_content:section_content
        })
          return res.status(201).json({ message: 'Data created successfully', data: newSection });
    }

}

