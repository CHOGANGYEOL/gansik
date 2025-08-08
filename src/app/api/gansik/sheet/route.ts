import { addSheet, appendGansikRequest } from "@/lib/googleSheet";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const ipRaw =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const ip = ipRaw.startsWith("::ffff:") ? ipRaw.replace("::ffff:", "") : ipRaw;

  const whiteList: string[] = JSON.parse(process.env.WHITE_LIST_IPS);
  if (!whiteList.includes(ip))
    return NextResponse.json(
      { data: null, message: "생성 권한이 없습니다." },
      { status: 403 }
    );

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
  } catch (e) {
    return NextResponse.json(
      { message: "Network error", data: null },
      { status: 500 }
    );
  }
}
