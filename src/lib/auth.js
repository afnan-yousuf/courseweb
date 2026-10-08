import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET
);


// ============================
// CREATE JWT
// ============================

export async function createToken(user) {
  return await new SignJWT({
    userId: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(secret);
}


// ============================
// VERIFY JWT
// ============================

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(
      token,
      secret
    );

    return payload;
  } catch (error) {
    return null;
  }
}


// ============================
// GET SESSION
// ============================

export async function getSession() {
  const cookieStore = await cookies();

  const token =
    cookieStore.get("session")?.value;

  if (!token) {
    return null;
  }

  return await verifyToken(token);
}


// ============================
// GET CURRENT DATABASE USER
// ============================

export async function getCurrentUser() {
  try {
    const session = await getSession();

    if (!session?.userId) {
      return null;
    }

    await dbConnect();

    const user = await User.findById(
      session.userId
    ).select("name email role");

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    return null;
  }
}