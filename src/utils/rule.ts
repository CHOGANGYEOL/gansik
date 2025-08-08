import { isValidCheck } from "./common";

export const PATTERNS = {
  ISOString: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/,
  URL: /^https?:\/\//,
};

export const RULES = {
  required: (v: string) => isValidCheck(v) || "This is a required field.",
};
