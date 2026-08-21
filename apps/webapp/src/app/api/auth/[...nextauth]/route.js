import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export const { auth, signIn, signOut, handlers } = NextAuth(authConfig);

// Turbopack 対応のエクスポート方法
export const GET = handlers.GET;
export const POST = handlers.POST;
