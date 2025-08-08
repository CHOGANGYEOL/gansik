import { appendGansikRequest, getSheetData } from "@/lib/googleSheet";
import { GetGansikResponse } from "@/services/gansik/types";
import { NextRequest, NextResponse } from "next/server";

type SSEClient = {
  id: string;
  sheetName: string;
  write: (message: string) => void;
  close: () => void;
};

let clients: SSEClient[] = [];

function sendEventToSheetSubscribers(
  sheetName: string,
  data: GetGansikResponse
) {
  const message = `data: ${JSON.stringify({ sheetName, data })}\n\n`;

  clients
    .filter((c) => c.sheetName === sheetName)
    .forEach((client) => {
      try {
        client.write(message);
      } catch (e) {
        console.error(`Failed to write to client ${client.id}`, e);
      }
    });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sheetName = searchParams.get("sheetName");

  if (!sheetName) {
    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        controller.enqueue(
          encoder.encode(
            `event: error\ndata: ${JSON.stringify({
              message: "Missing sheetName",
            })}\n\n`
          )
        );
        controller.close();
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }

  const initialData = await getSheetData(sheetName);

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      const id = Date.now().toString();
      const write = (msg: string) => {
        controller.enqueue(encoder.encode(msg));
      };
      const close = () => {
        controller.close();
        clients = clients.filter((c) => c.id !== id);
      };

      clients.push({ id, sheetName, write, close });

      write(`data: ${JSON.stringify({ sheetName, data: initialData })}\n\n`);

      req.signal.addEventListener("abort", () => {
        close();
      });
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const ipRaw =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const ip = ipRaw.startsWith("::ffff:") ? ipRaw.replace("::ffff:", "") : ipRaw;

  const ipList: Record<string, string> = JSON.parse(
    process.env.TRUSTED_IPS ?? "{}"
  );
  const user = ipList[ip] ?? ip;
  const createdAt = new Date().toISOString();

  const { link, name, sheetName } = body;
  await appendGansikRequest(sheetName, [name, link, user, createdAt]);

  const updatedData = await getSheetData(sheetName);
  sendEventToSheetSubscribers(sheetName, updatedData);

  return NextResponse.json({ message: "success", data: null }, { status: 200 });
}
