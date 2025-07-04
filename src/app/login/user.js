import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async  (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  console.log(session);
};
