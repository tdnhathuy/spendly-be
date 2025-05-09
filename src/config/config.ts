import { config as configDotenv } from "dotenv";

configDotenv();

const url =
  process.env.MONGODB_URL ||
  "mongodb+srv://tdnhathuy:gR5IFS2o2fJdwOUG@dummy-cluster.rubf9uh.mongodb.net/?retryWrites=true&w=majority&appName=dummy-cluster";

const dbName =
  process.env.MONGODB_DB || process.env.NODE_ENV === "production"
    ? "spendly"
    : "spendly-dev";

const JWT_SECRET = "Dd8yhHC9d/eyIF0I6+7Vnmn1stzgtrvY+NV2TNTTwjc=";

export const config = {
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 2703,
    host: process.env.HOST || "0.0.0.0",
  },
  mongodb: {
    url: url,
    dbName: dbName,
  },
  swagger: {
    routePrefix: "/docs",
  },
  auth: {
    // Ưu tiên biến môi trường nếu có, nếu không dùng giá trị cố định
    jwtSecret: JWT_SECRET,
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackUrl: process.env.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
    },
    cookieSecure: process.env.NODE_ENV === "production",
  },
};
