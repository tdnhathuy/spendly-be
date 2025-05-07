// Cấu hình ứng dụng
export const config = {
  server: {
    port: 2703,
    host: '0.0.0.0'
  },
  mongodb: {
    url: "mongodb+srv://tdnhathuy:gR5IFS2o2fJdwOUG@dummy-cluster.rubf9uh.mongodb.net/?retryWrites=true&w=majority&appName=dummy-cluster",
    dbName: "spendly"
  },
  swagger: {
    routePrefix: "/docs"
  }
} 