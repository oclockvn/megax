import dateLib from "./datetime";
const isoFormat =
  /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/;

export function handleResponse(body: any) {
  if (body == null || typeof body !== "object") {
    return body;
  }

  for (const key of Object.keys(body)) {
    const value = body[key];
    if (isIsoDateString(value)) {
      body[key] = dateLib.parseISO(value);
    } else if (typeof value === "object") {
      handleResponse(value);
    }
  }
}

function isIsoDateString(value: any): boolean {
  return value && typeof value === "string" && isoFormat.test(value);
}
