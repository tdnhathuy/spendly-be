const { execSync } = require('child_process');
const fs = require('fs');

// Kiểm tra xem thư mục build có tồn tại không
if (!fs.existsSync('./build')) {
  console.log('Thư mục build không tồn tại, đang tạo...');
  fs.mkdirSync('./build', { recursive: true });
}

// Kiểm tra và tạo thư mục api nếu chưa tồn tại
if (!fs.existsSync('./api')) {
  console.log('Thư mục api không tồn tại, đang tạo...');
  fs.mkdirSync('./api', { recursive: true });
}

// Thực hiện compile TypeScript
try {
  console.log('Đang biên dịch TypeScript...');
  execSync('tsc -p tsconfig.json', { stdio: 'inherit' });
  console.log('Biên dịch TypeScript thành công!');
} catch (error) {
  console.error('Lỗi khi biên dịch TypeScript:', error);
  process.exit(1);
} 