// Cấu hình ứng dụng

const dbName =
  process.env.MONGODB_DB || process.env.NODE_ENV === "production"
    ? "spendly"
    : "spendly-dev";

export const config = {
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 2703,
    host: process.env.HOST || "0.0.0.0",
  },
  mongodb: {
    url: process.env.MONGODB_URL,
    dbName: dbName,
  },
  swagger: {
    routePrefix: "/docs",
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackUrl: process.env.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
    },
    cookieSecure: process.env.NODE_ENV === "production",
  },
};
