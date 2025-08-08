interface GetGansikRequest {
  sheetName: string;
}

interface GetGansikResponse {
  headers: string[];
  rows: string[][];
}

interface PostGansikRequest extends GetGansikRequest {
  link: string;
  name: string;
}

export type { PostGansikRequest, GetGansikRequest, GetGansikResponse };
