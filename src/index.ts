import Fastify from "fastify";
import app from "./app";

import * as dotenv from "dotenv";
import { config } from "./config/config";
dotenv.config();

const PORT = config.server.port || 3000;
const HOST = config.server.host || "0.0.0.0";

const server = Fastify();

server.register(app);

const start = async () => {
  try {
    await server.listen({ port: Number(PORT), host: HOST });
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
