import { getSheetNames } from "@/lib/googleSheet";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await getSheetNames();
  return NextResponse.json({ data, message: "success" }, { status: 200 });
}
