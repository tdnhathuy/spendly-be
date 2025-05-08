import Fastify from "fastify";
import app from "./app";

import * as dotenv from "dotenv";
import { config } from "./config/config";
dotenv.config();

console.log("Khởi động ứng dụng với cấu hình:", {
  port: config.server.port,
  host: config.server.host
});

const PORT = config.server.port || 3000;
const HOST = config.server.host || "0.0.0.0";

const server = Fastify({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty'
    }
  }
});

console.log("Đăng ký các routes và plugins...");
server.register(app);

const start = async () => {
  try {
    console.log(`Đang cố gắng lắng nghe tại ${HOST}:${PORT}...`);
    await server.listen({ port: Number(PORT), host: HOST });
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
  } catch (err) {
    console.error("Lỗi khi khởi động server:", err);
    server.log.error(err);
    process.exit(1);
  }
};

console.log("Gọi hàm start()...");
start();
console.log("Đã gọi hàm start() và đang chờ kết quả...");
