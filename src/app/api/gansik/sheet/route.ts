import { addSheet, appendGansikRequest } from "@/lib/googleSheet";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { sheetName } = body;
  if (!sheetName) {
    return NextResponse.json(
      { message: "Missing sheetName", data: null },
      { status: 400 }
    );
  }
  try {
    await addSheet(sheetName);
    await appendGansikRequest(sheetName, [
      "간식명",
      "url",
      "작성자",
      "등록일시",
    ]);

    return NextResponse.json(
      { message: "success", data: null },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Network error", data: null },
      { status: 500 }
    );
  }
}
