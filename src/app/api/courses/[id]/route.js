import dbConnect from "@/lib/mongodb";
import Course from "@/models/Course";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  await dbConnect();
  const { id } = await params;
  try {
    const body = await request.json();
    const updatedCourse = await Course.findOneAndUpdate(
      { course_id: id },
      body,
      { new: true }
    );
    return NextResponse.json({ success: true, data: updatedCourse }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}