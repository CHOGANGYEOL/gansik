import { getRangeFromLength } from "@/utils/common";
import { google } from "googleapis";
const auth = new google.auth.JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

export const getSheetData = async (sheetTitle: string) => {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `${sheetTitle}!A1:Z1000`,
  });
  const [headers, ...rows] = res.data.values ?? [];
  return { headers, rows };
};

export const appendGansikRequest = async (
  sheetName: string,
  data: string[]
) => {
  const range = `${sheetName}!${getRangeFromLength(data.length)}`;

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [data],
    },
  });
};

export const getSheetNames = async (): Promise<string[]> => {
  const res = await sheets.spreadsheets.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
  });

  return (
    res.data.sheets
      ?.map((sheet) => sheet.properties?.title)
      .filter((title): title is string => Boolean(title)) ?? []
  );
};

export const addSheet = async (sheetName: string) => {
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    requestBody: {
      requests: [
        {
          addSheet: {
            properties: {
              title: sheetName,
            },
          },
        },
      ],
    },
  });
};
