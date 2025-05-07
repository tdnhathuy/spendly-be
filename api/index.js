// Import server được build từ TypeScript
const { buildApp } = require('../build/app');

module.exports = async (req, res) => {
  try {
    const fastify = await buildApp();
    
    // Đảm bảo server đã sẵn sàng
    await fastify.ready();
    
    // Xử lý request
    fastify.server.emit('request', req, res);
  } catch (error) {
    // Xử lý lỗi
    console.error('Lỗi serverless function:', error);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
}; 