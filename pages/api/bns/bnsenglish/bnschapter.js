import { connectDB } from "../../../../lib/db";
import Bnsen from "../../../../lib/schema/bnsen";

let bnshi = []
export default async function handler(req, res) {
    await connectDB()

    if (req.method == "GET") {
        const { search } = req.query
        console.log("hello", bnshi.length)
        if (bnshi.length ===0) {
            bnshi = await Bnsen.find()
        }
        bnshi.map((item) => {
            if (item.chapter === search) {
                return res.status(200).json({ chapter: item })
            }
        })
    }

}