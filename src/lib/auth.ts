import jwt from "jsonwebtoken";

export function getUserIdFromHeader(header?: string) {
  if (!header?.startsWith("Bearer ")) return null;
  const token = header.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "") as {
      userId: string;
    };
    return payload.userId;
  } catch {
    return null;
  }
}
