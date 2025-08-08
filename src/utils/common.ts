export const isValidCheck = (value: unknown): boolean => {
  if (value === null || value === undefined) return false;

  switch (typeof value) {
    case "string":
      return value.trim() !== "" && value !== "ALL";
    case "number":
      return value !== -1 && !isNaN(value);
    case "object":
      if (Array.isArray(value)) {
        return value.some((el) => isValidCheck(el));
      }

      if (value instanceof Date) {
        return !isNaN(value.getTime());
      }

      if (value instanceof Set || value instanceof Map) {
        return value.size > 0;
      }

      return (
        !!value &&
        Object.keys(value).length > 0 &&
        Object.values(value).every((v) => isValidCheck(v))
      );
    case "boolean":
      return value;
    default:
      return false;
  }
};
export const setSearchParams = (params: object): string => {
  const filteredParams = Object.entries(params)
    .filter(([, value]) => isValidCheck(value))
    .reduce((acc, [key, value]) => {
      switch (key) {
        default:
          if (Array.isArray(value)) {
            value.forEach((v) => acc.append(key, v));
          } else {
            acc.append(key, String(value));
          }
          break;
      }
      return acc;
    }, new URLSearchParams());

  return filteredParams.size > 0 ? `?${filteredParams.toString()}` : "";
};
export const getRangeFromLength = (length: number) => {
  const colLetter = (index: number): string => {
    let result = "";
    while (index >= 0) {
      result = String.fromCharCode((index % 26) + 65) + result;
      index = Math.floor(index / 26) - 1;
    }
    return result;
  };

  const lastCol = colLetter(length - 1);
  return `A1:${lastCol}1`;
};
