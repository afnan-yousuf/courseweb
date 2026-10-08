import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();

    const { name, email, password, role } = body;

    if (!name || !email || !password) {
      return Response.json(
        {
          success: false,
          message: "Name, email and password are required",
        },
        {
          status: 400,
        }
      );
    }

    if (password.length < 6) {
      return Response.json(
        {
          success: false,
          message: "Password must be at least 6 characters",
        },
        {
          status: 400,
        }
      );
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return Response.json(
        {
          success: false,
          message: "Email already registered",
        },
        {
          status: 409,
        }
      );
    }

    const hashedPassword = await bcrypt.hash(
      password,
      12
    );

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,

      // Classroom bootstrap only
      role: role === "admin" ? "admin" : "teacher",
    });

    return Response.json(
      {
        success: true,
        message: "User registered successfully",
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Registration failed",
      },
      {
        status: 500,
      }
    );
  }
}