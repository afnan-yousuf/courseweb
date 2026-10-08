import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET
);

async function verifyToken(token) {
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

export default async function proxy(request) {
  const pathname = request.nextUrl.pathname;

  const token =
    request.cookies.get("session")?.value;

  // =========================
  // No Token
  // =========================

  if (!token) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  // =========================
  // Verify Token
  // =========================

  const session = await verifyToken(token);

  if (!session) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  // =========================
  // Check Admin Role
  // =========================

  if (session.role !== "admin") {
    return NextResponse.redirect(
      new URL("/admin", request.url)
    );
  }

  // =========================
  // Admin Allowed
  // =========================

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};