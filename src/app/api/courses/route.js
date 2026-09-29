import dbConnect from "@/lib/mongodb";
import Course from "@/models/Course";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  try {
    const courses = await Course.find({ is_Deleted: false }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: courses }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const newCourse = await Course.create({
      course_id: "c_" + Math.random().toString(36).substring(2, 9),
      ...body,
    });
    return NextResponse.json({ success: true, data: newCourse }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}