import { GetGansikRequest, PostGansikRequest } from "./types";
import { CommonResponse } from "../types";

const isServer = typeof window === "undefined";
const gansik = {
  getGansikSheetNames: async (): Promise<CommonResponse<string[]>> =>
    isServer
      ? { data: [], message: "is server" }
      : (await fetch(`/api/gansik/sheet-names`)).json(),
  postGansik: async (payload: PostGansikRequest): Promise<Response> =>
    isServer
      ? new Response()
      : await fetch(`/api/gansik`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
  postAddSheet: async (payload: GetGansikRequest): Promise<Response> =>
    isServer
      ? new Response()
      : await fetch(`/api/gansik/sheet`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
};

export default gansik;
