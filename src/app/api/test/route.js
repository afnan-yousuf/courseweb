import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    
    return NextResponse.json({ success: true, data: body }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}