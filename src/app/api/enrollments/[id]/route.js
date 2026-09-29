import dbConnect from "@/lib/mongodb";
import Enrollment from "@/models/Enrollment";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  await dbConnect();
  const { id } = await params;
  try {
    const body = await request.json();
    const updatedEnrollment = await Enrollment.findOneAndUpdate(
      { enrollment_id: id },
      body,
      { new: true }
    );
    return NextResponse.json({ success: true, data: updatedEnrollment }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}