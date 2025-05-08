// Cấu hình ứng dụng
export const config = {
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 2703,
    host: process.env.HOST || '0.0.0.0'
  },
  mongodb: {
    url: process.env.MONGODB_URL || "mongodb+srv://tdnhathuy:gR5IFS2o2fJdwOUG@dummy-cluster.rubf9uh.mongodb.net/?retryWrites=true&w=majority&appName=dummy-cluster",
    dbName: process.env.MONGODB_DB || "spendly"
  },
  swagger: {
    routePrefix: "/docs"
  }
} 