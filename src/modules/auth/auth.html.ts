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
    .usage-info {
      margin-top: 30px;
      padding: 20px;
      background-color: #e8f5e9;
      border-radius: 4px;
      border-left: 4px solid #2e7d32;
    }
    .usage-info h3 {
      margin-top: 0;
      color: #2e7d32;
    }
    .code-example {
      background-color: #333;
      color: #fff;
      padding: 15px;
      border-radius: 4px;
      margin-top: 10px;
      overflow-x: auto;
    }
    .copy-button {
      background-color: #4caf50;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 10px;
      font-size: 14px;
    }
    .copy-button:hover {
      background-color: #388e3c;
    }
    .routes-list {
      margin-top: 15px;
    }
    .routes-list li {
      margin-bottom: 8px;
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
        <button class="copy-button" onclick="copyToken()">Sao chép Token</button>
      </div>
      
      <div class="usage-info">
        <h3>Cách sử dụng token</h3>
        <p>Sử dụng token này trong header Authorization cho các request API:</p>
        <div class="code-example">
          Authorization: Bearer <span id="token-placeholder">your_token_here</span>
        </div>
        
        <p>Các route được bảo vệ bằng JWT:</p>
        <ul class="routes-list">
          <li><strong>/profile</strong> - Xem thông tin cá nhân</li>
          <li><strong>/transaction</strong> - Xem danh sách giao dịch</li>
        </ul>
        
        <p>Ví dụ sử dụng với fetch API:</p>
        <div class="code-example">
fetch('/profile', {
  headers: {
    'Authorization': 'Bearer <span id="token-fetch-example">your_token_here</span>'
  }
})
.then(response => response.json())
.then(data => console.log(data))
        </div>
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
      document.getElementById('token').textContent = 'Bearer ' + userData.token;
      
      // Cập nhật các ví dụ token
      document.getElementById('token-placeholder').textContent = userData.token;
      document.getElementById('token-fetch-example').textContent = userData.token;
    }
    
    // Hàm sao chép token
    function copyToken() {
      const tokenText = document.getElementById('token').textContent;
      navigator.clipboard.writeText(tokenText)
        .then(() => {
          alert('Đã sao chép token vào clipboard!');
        })
        .catch(err => {
          console.error('Lỗi khi sao chép:', err);
        });
    }
  </script>
</body>
</html>
`;
