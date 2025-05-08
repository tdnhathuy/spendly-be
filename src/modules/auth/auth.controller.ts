import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ServiceAuth } from "./auth.service";
import axios from "axios";
import { config } from "../../config/config";
import { loginPage, successPage } from "./auth.html";

interface CustomRequest extends FastifyRequest {
  user: {
    id: string;
    email: string;
  };
}

export const ControllerAuth = {
  // Xử lý chuyển hướng OAuth từ client
  handleGoogleLogin: async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      console.log('Bắt đầu quá trình đăng nhập Google');
      
      // Tạo URL chuyển hướng đến Google
      const authorizationUri = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${
        config.auth.google.clientId
      }&redirect_uri=${
        encodeURIComponent(config.auth.google.callbackUrl)
      }&response_type=code&scope=email%20profile&access_type=offline&prompt=consent`;
      
      console.log('Chuyển hướng đến URL OAuth2:', authorizationUri);
      return reply.redirect(authorizationUri);
    } catch (error) {
      console.error('Lỗi khi bắt đầu đăng nhập Google:', error);
      return reply.redirect('/login?error=auth_failed');
    }
  },
  
  // Xử lý callback từ Google OAuth
  googleLoginCallback: async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      console.log('Bắt đầu xử lý callback Google, query:', request.query);
      const query = request.query as any;
      
      // Kiểm tra lỗi hoặc code từ Google
      if (query.error) {
        console.error('Lỗi từ Google OAuth:', query.error);
        return reply.redirect('/login?error=auth_failed');
      }
      
      if (!query.code) {
        console.error('Không nhận được code từ Google');
        return reply.redirect('/login?error=auth_failed');
      }
      
      // Đổi code lấy token
      console.log('Đang đổi code lấy token...');
      const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
        code: query.code,
        client_id: config.auth.google.clientId,
        client_secret: config.auth.google.clientSecret,
        redirect_uri: config.auth.google.callbackUrl,
        grant_type: 'authorization_code'
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const tokens = tokenResponse.data;
      console.log('Đã nhận tokens từ Google:', Object.keys(tokens));
      
      // Lấy thông tin người dùng từ Google
      console.log('Đang lấy thông tin người dùng từ Google...');
      const { data } = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`
        }
      });
      console.log('Đã nhận thông tin người dùng từ Google:', { 
        id: data.id, 
        email: data.email 
      });
      
      // Tạo hoặc cập nhật user trong DB và tạo JWT
      console.log('Đang tạo hoặc cập nhật người dùng trong DB...');
      const server = request.server as FastifyInstance;
      const result = await ServiceAuth.findOrCreateGoogleUser(server, {
        id: data.id,
        name: data.name,
        email: data.email,
        picture: data.picture
      });
      console.log('Đã tạo/cập nhật người dùng và token:', !!result?.token);
      
      // Chuyển hướng đến trang thành công và truyền dữ liệu
      const userData = encodeURIComponent(JSON.stringify({
        token: result.token,
        user: result.user
      }));
      
      return reply.redirect(`/auth/success?data=${userData}`);
    } catch (error) {
      console.error('Lỗi đăng nhập Google:', error);
      // Log chi tiết về lỗi
      if (error instanceof Error) {
        console.error('Tên lỗi:', error.name);
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);
      }
      if (axios.isAxiosError(error) && error.response) {
        console.error('Lỗi từ API Google:', {
          status: error.response.status,
          data: error.response.data
        });
      }
      return reply.redirect('/login?error=auth_failed');
    }
  },
  
  getCurrentUser: async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const server = request.server as FastifyInstance;
      const user = request.user as { id: string, email: string };
      
      const userInfo = await ServiceAuth.getUserById(server, user.id);
      if (!userInfo) {
        return reply.code(404).send({ error: 'Không tìm thấy người dùng' });
      }
      
      return {
        user: {
          id: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
          picture: userInfo.picture,
          provider: userInfo.provider,
          createdAt: userInfo.createdAt,
          updatedAt: userInfo.updatedAt
        }
      };
    } catch (error) {
      console.error('Lỗi lấy thông tin người dùng:', error);
      return reply.code(500).send({ error: 'Lỗi máy chủ' });
    }
  },
  
  logout: async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    reply.clearCookie('auth_token', { path: '/' });
    return { success: true, message: 'Đã đăng xuất thành công' };
  },

  renderLoginPage: async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    reply.type('text/html').send(loginPage);
  },

  renderSuccessPage: async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    reply.type('text/html').send(successPage);
  }
}; 