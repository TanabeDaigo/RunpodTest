import "reflect-metadata";
import { reloadDIContainer } from "@server/createDIContainer";

export async function POST() {
  try {
    if (process.env.NODE_ENV !== "development") {
      return Response.json({ error: "開発環境でのみ利用可能です" }, { status: 403 });
    }

    await reloadDIContainer();
    return Response.json({ message: "DIコンテナが再読み込みされました" });
  } catch (error) {
    console.error("DIコンテナ再読み込みエラー:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
