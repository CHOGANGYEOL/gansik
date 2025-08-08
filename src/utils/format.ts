export const formatDate = (
  date: Date | null,
  format = "yyyy-MM-dd"
): string => {
  if (!date) return "";
  if (typeof date === "string") return date;

  const components: Record<string, string> = {
    yyyy: String(date.getFullYear()),
    MM: String(date.getMonth() + 1).padStart(2, "0"),
    dd: String(date.getDate()).padStart(2, "0"),
    D: ["일", "월", "화", "수", "목", "금", "토"][date.getDay()],
    hh: String(date.getHours()).padStart(2, "0"),
    mm: String(date.getMinutes()).padStart(2, "0"),
    ss: String(date.getSeconds()).padStart(2, "0"),
  };

  return format.replace(/yyyy|MM|dd|D|hh|mm|ss/g, (match) => components[match]);
};
