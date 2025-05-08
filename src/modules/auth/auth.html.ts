export const loginPage = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Đăng nhập</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
    }
    .login-container {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      padding: 40px;
      width: 400px;
      max-width: 90%;
      text-align: center;
    }
    h1 {
      color: #333;
      margin-bottom: 24px;
    }
    .login-button {
      background-color: #4285F4;
      color: white;
      border: none;
      padding: 12px 16px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      margin: 16px auto;
      cursor: pointer;
      font-size: 16px;
      transition: background-color 0.3s;
      text-decoration: none;
    }
    .login-button:hover {
      background-color: #357ae8;
    }
    .login-button img {
      margin-right: 8px;
      width: 24px;
      height: 24px;
    }
    .error-message {
      color: #d32f2f;
      margin-top: 16px;
    }
  </style>
</head>
<body>
  <div class="login-container">
    <h1>Đăng nhập</h1>
    
    <a href="/api/auth/google" class="login-button">
      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google icon">
      Đăng nhập với Google
    </a>
    
    <div id="error-container" class="error-message"></div>
  </div>

  <script>
    // Kiểm tra lỗi từ URL nếu có
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    if (error) {
      const errorContainer = document.getElementById('error-container');
      if (error === 'auth_failed') {
        errorContainer.textContent = 'Đăng nhập thất bại. Vui lòng thử lại.';
      }
    }
  </script>
</body>
</html>
`;

export const successPage = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Đăng nhập thành công</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
    }
    .success-container {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      padding: 40px;
      width: 600px;
      max-width: 90%;
    }
    h1 {
      color: #4caf50;
      margin-bottom: 24px;
      text-align: center;
    }
    .user-info {
      margin-top: 20px;
      padding: 20px;
      background-color: #f9f9f9;
      border-radius: 4px;
      border-left: 4px solid #4caf50;
    }
    .token {
      margin-top: 20px;
      word-break: break-all;
      font-family: monospace;
      background-color: #f1f1f1;
      padding: 15px;
      border-radius: 4px;
      overflow-x: auto;
    }
    pre {
      margin: 0;
      white-space: pre-wrap;
    }
    .label {
      font-weight: bold;
      margin-top: 10px;
      color: #555;
    }
    img.avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      margin: 0 auto 20px;
      display: block;
      border: 3px solid #4caf50;
    }
  </style>
</head>
<body>
  <div class="success-container">
    <h1>Đăng nhập thành công</h1>
    
    <div id="user-container">
      <img id="avatar" class="avatar" src="" alt="Avatar người dùng">
      <div class="user-info">
        <div class="label">Thông tin người dùng:</div>
        <pre id="user-info"></pre>
      </div>
      
      <div class="token">
        <div class="label">Token JWT:</div>
        <pre id="token"></pre>
      </div>
    </div>
  </div>

  <script>
    // Lấy dữ liệu từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const userData = JSON.parse(decodeURIComponent(urlParams.get('data')));
    
    // Hiển thị dữ liệu
    if (userData) {
      document.getElementById('avatar').src = userData.user.picture || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(userData.user.name);
      document.getElementById('user-info').textContent = JSON.stringify(userData.user, null, 2);
      document.getElementById('token').textContent = userData.token;
    }
  </script>
</body>
</html>
`;
