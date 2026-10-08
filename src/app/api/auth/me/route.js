import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      {
        status: 401,
      } 
    );
  }

  return Response.json({
    success: true,

    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}