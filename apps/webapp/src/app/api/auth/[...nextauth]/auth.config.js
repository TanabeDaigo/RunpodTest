/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - NextAuth Configuration                            ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   NextAuthの設定ファイル                                     ║
 * ║   認証プロバイダーとセッション管理                           ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 */
// tsyringeのDIコンテナを使用するため、reflect-metadataをインポート
import "reflect-metadata";
import CredentialsProvider from "next-auth/providers/credentials";
import logjs from "@metrojs/logjs";
import NextAuth from "next-auth";
import { config } from "@common/config";
import { utils } from "@lib/server";

const log = new logjs("api/auth/[...nextauth]/auth.config");

//console.dir(config);

const is_production = process.env.NODE_ENV === "production";
// セッションの有効期限（秒）
const SESSION_MAX_AGE = Number(config.SESSION_MAX_AGE);

// デフォルトのユーザー情報
const DEFAULT_USER = {
  id: "",
  user_id: "",
  login_id: "",
  user_name: "",
  email: "",
  role: "user",
  image: null,
};

// ユーザー情報の構造を定義
const createUserInfo = (userData) => {
  if (!userData) return DEFAULT_USER;

  return {
    ...DEFAULT_USER,
    id: userData.user_id || "",
    user_id: userData.user_id || "",
    login_id: userData.login_id || "",
    user_name: userData.user_name || "",
    email: userData.mail1 || "",
    role: userData.role || "user",
    image: userData.image_url || null,
  };
};

// トークンまたはセッションにユーザー情報を設定する関数
const setUserInfo = (target, source) => {
  if (!source) return DEFAULT_USER;
  if (!target) return { ...DEFAULT_USER, ...source };

  return {
    ...DEFAULT_USER,
    ...target,
    ...source,
  };
};

export const authConfig = {
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        login_id: { label: "LoginId", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (utils.isNullOrEmpty(credentials?.login_id) || utils.isNullOrEmpty(credentials?.password)) {
            log.error("Missing credentials");
            throw new Error("ログインIDまたはパスワードが正しくありません");
          }

          if (!credentials?.login_id || !credentials?.password) {
            log.error("Missing credentials");
            throw new Error("ログインIDまたはパスワードが正しくありません");
          }

          const _dbjs = await globalThis.container.resolve("dbjs");
          const result = await _dbjs.selectOne("select * from users where login_id = ? and password = ?", [credentials.login_id, credentials.password]);
          log.info("result", result);
          if (!result || Object.keys(result).length === 0) {
            throw new Error("ログインIDまたはパスワードが正しくありません");
          }

          return createUserInfo(result);
        } catch (error) {
          log.error("認証エラー:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user, account, trigger }) {
      if (user) {
        token = setUserInfo(token, user);
      }
      if (trigger === "update" && token) {
        // セッション更新時の処理
        return token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = setUserInfo(session.user, token);
        session.expires = new Date(Date.now() + SESSION_MAX_AGE * 1000).toISOString();
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE,
    updateAge: 24 * 60 * 60, // 24時間ごとにセッションを更新
  },
  jwt: {
    maxAge: SESSION_MAX_AGE,
  },
  debug: process.env.NODE_ENV === "development",
  logger: {
    error(code, metadata) {
      log.error(code, metadata);
    },
    warn(code) {
      log.warn(code);
    },
    debug(code, metadata) {
      log.debug(code, metadata);
    },
  },
  events: {
    async signOut({ token }) {
      // セッションのクリーンアップ処理
      log.info("セッションのクリーンアップ処理");
      return {
        redirect: false,
      };
    },
  },
};

const handler = NextAuth(authConfig);
export { handler as GET, handler as POST };
