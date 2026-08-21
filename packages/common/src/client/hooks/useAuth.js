import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * 認証状態を監視するカスタムフック
 * @param {Object} options - オプション
 * @param {boolean} options.required - 認証が必要かどうか
 * @param {string} options.redirectTo - リダイレクト先
 * @returns {Object} 認証状態
 */
export function useAuth({ required = false, redirectTo = "/login" } = {}) {
  const { data: session, status } = useSession() || { data: null, status: "unauthenticated" };
  const router = useRouter();
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    // 認証が必要で、ローディングが完了し、認証されていない場合
    if (required && !isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [required, isLoading, isAuthenticated, redirectTo, router]);

  // 初期状態を明示的に設定
  return {
    session: session || null,
    status: status || "unauthenticated",
    isLoading: isLoading || false, // 明示的にfalseを設定
    isAuthenticated: isAuthenticated || false, // 明示的にfalseを設定
  };
}
