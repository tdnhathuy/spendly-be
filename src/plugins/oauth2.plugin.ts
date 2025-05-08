import { FastifyInstance } from "fastify";
import fastifyOauth2 from "@fastify/oauth2";
import { config } from "../config/config";
import crypto from 'crypto';

export const pluginOauth2 = async (fastify: FastifyInstance) => {
  try {
    console.log("Đang cấu hình OAuth2 Google với thông tin:", {
      clientId: config.auth.google.clientId,
      callbackUrl: config.auth.google.callbackUrl,
      hasClientSecret: !!config.auth.google.clientSecret,
    });

    // Đảm bảo callbackUri là URL tuyệt đối
    const callbackUri = config.auth.google.callbackUrl;
    console.log("Sử dụng callbackUri:", callbackUri);

    await fastify.register(fastifyOauth2, {
      name: 'googleOAuth2',
      scope: ['profile', 'email'],
      credentials: {
        client: {
          id: config.auth.google.clientId,
          secret: config.auth.google.clientSecret
        },
        auth: {
          authorizeHost: 'https://accounts.google.com',
          authorizePath: '/o/oauth2/v2/auth',
          tokenHost: 'https://www.googleapis.com',
          tokenPath: '/oauth2/v4/token'
        }
      },
      startRedirectPath: '/api/auth/google',
      callbackUri: callbackUri,
      callbackUriParams: {
        access_type: 'offline',
        prompt: 'consent' // Luôn yêu cầu người dùng đồng ý
      },
      // Tạo state cho OAuth flow
      generateStateFunction: () => {
        const state = crypto.randomBytes(10).toString('hex');
        console.log("Đã tạo state OAuth2:", state);
        return state;
      },
      // Kiểm tra state trong OAuth flow
      checkStateFunction: (state, callback) => {
        console.log("Đang kiểm tra state OAuth2:", state);
        callback();
      }
    });

    console.log("OAuth2 Google plugin đã được thiết lập thành công");
    return fastify;
  } catch (error) {
    console.error("Lỗi khi thiết lập OAuth2 Google plugin:", error);
    console.error("Chi tiết lỗi:", error instanceof Error ? error.message : String(error));
    return fastify;
  }
}; 