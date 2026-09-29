import dbConnect from "@/lib/mongodb";
import Enrollment from "@/models/Enrollment";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  try {
    const enrollments = await Enrollment.find({ is_Deleted: false }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: enrollments }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const newEnrollment = await Enrollment.create({
      enrollment_id: "en_" + Math.random().toString(36).substring(2, 9),
      student_id: "st_" + Math.random().toString(36).substring(2, 9),
      status: "Pending",
      ...body,
    });
    return NextResponse.json({ success: true, data: newEnrollment }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}