import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { createToken } from "@/lib/auth";

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();

    const { email, password } = body;

    if (!email || !password) {
      return Response.json(
        {
          success: false,
          message: "Email and password are required",
        },
        {
          status: 400,
        }
      );
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        {
          status: 401,
        }
      );
    }

    const passwordMatched =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatched) {
      return Response.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        {
          status: 401,
        }
      );
    }

    const token = await createToken(user);

    const cookieStore = await cookies();

    cookieStore.set("session", token, {
      httpOnly: true,
      secure:
        process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return Response.json({
      success: true,
      message: "Login successful",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Login failed",
      },
      {
        status: 500,
      }
    );
  }
}