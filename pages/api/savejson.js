import { writeFile } from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(400).json(JSON.stringify({ success: false }))
    }
    try {
      const {bnsdata}  = req.body;
    // console.log("Received data:", bnsdata);
    const filePath = path.join(process.cwd(), 'public', 'bns_data.json');
    const result= await writeFile(filePath, JSON.stringify(bnsdata, null, 2), 'utf-8');
    return res.status(200).json(JSON.stringify({ success: bnsdata, result }))
  } catch (error) {
    return res.status(400).json(JSON.stringify({ success: false }))
  }
}
