import { NextResponse } from "next/server";
import mongoose, { connect } from "mongoose";
import dbConnect from "@/lib/mongodb";
import Enrollment from "@/models/Enrollment";

export async function POST(request){
    await dbConnect()
    try {
        const body = await request.json();
        const user = await Enrollment.find({ is_Deleted: false, student_name: body.uname, student_email:body.pass });
        if(user.length < 1){
            return NextResponse.json({success: false}, {status: 401})
        }
        return NextResponse.json({ success: true, data: user }, { status: 200 });
      } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
      }
}
