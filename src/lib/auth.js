import { getServerSession } from "next-auth";
import { connectDB } from "../../lib/db";
import { authOptions } from "../../pages/api/auth/[...nextauth]";


export async function getAuthSession() {
    await connectDB();
    const session = await getServerSession(authOptions);
    return session;
}