export const PORT = process.env.PORT || 8080;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const __prod__ = NODE_ENV === "production";

// Express Session
export const SESSION_SECRET =
  process.env.SESSION_SECRET || "0zYC8sd7mLPVM7Nnxcmw5umufnWrYquv";
export const SESSION_MAX_AGE = 1000 * 60 * 60 * 24 * 365; // 1 Year
