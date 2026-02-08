import { connectDB } from "../../../../../lib/db";
import ForumCategory from "../../../../../lib/models/ForumCategory";

const DEFAULT_CATEGORIES = [
  { slug: "general", title: "सामान्य प्रश्न", desc: "कानून से जुड़े सामान्य सवाल और उत्तर।", count: 124 },
  { slug: "sections", title: "धाराओं का विश्लेषण", desc: "किसी धारा के अर्थ, प्रभाव और उदाहरण।", count: 86 },
  { slug: "updates", title: "अपडेट्स और बदलाव", desc: "नए संशोधन या बदलावों पर चर्चा।", count: 42 },
];

export async function GET() {
  await connectDB();

  let categories = await ForumCategory.find().lean();
  if (!categories.length) {
    await ForumCategory.insertMany(DEFAULT_CATEGORIES);
    categories = await ForumCategory.find().lean();
  }

  return Response.json({
    categories: categories.map((c) => ({
      id: c._id.toString(),
      slug: c.slug,
      title: c.title,
      desc: c.desc,
      count: c.count ?? 0,
    })),
  });
}
