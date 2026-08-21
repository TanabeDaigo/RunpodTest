import { injectable } from "tsyringe";
import AbstractDao from "../AbstractDao";
import { logjs, sqljs, dayjs } from "@lib/server";

const log = new logjs("ProjectsDao");

/**
 * プロジェクト情報を管理するDAOクラス
 * プロジェクトの検索、取得などのデータベース操作を担当
 */
@injectable()
class ProjectsDao extends AbstractDao {
  constructor() {
    super("projects");
  }

  /**
   * プロジェクト情報を検索・取得する
   * @param {Object} params - 検索パラメータ
   * @param {number} [params.page=1] - ページ番号
   * @param {number} [params.pageSize=100] - 1ページあたりの件数
   * @param {string} [params.sortKey="project_id"] - ソートキー
   * @param {string} [params.sortOrder="desc"] - ソート順序
   * @returns {Object} 検索結果（rows, total, page, pageSize）
   */
  async find(params) {
    log.debug("find params", params);

    // パラメータのデフォルト値を設定
    const {
      page = 1,
      pageSize = 100,
      sortKey = "project_id", // 指定していなければプライマリキーの先頭
      sortOrder = "desc", // 指定していなければ降順
    } = params;

    try {
      // ページネーション用のオフセット計算
      const offset = (page - 1) * pageSize;

      // SQLクエリビルダーの初期化
      const _sqljs = new sqljs();

      // 取得するカラムの指定
      _sqljs.select([
        "pr.project_id as project_id",
        "pr.project_name as project_name",
        "pr.dbms_id as dbms_id",
        "pr.db_server as db_server",
        "pr.db_port as db_port",
        "pr.db_name as db_name",
        "pr.db_user as db_user",
        "pr.db_pass as db_pass",
        "pr.db_encoding as db_encoding",
        "pr.template_id as template_id",
        "pr.comments as comments",
        "pr.sort as sort",
        "pr.status as status",
        "pr.is_deleted as is_deleted",
        "pr.dbcount as dbcount",
        "pr.regist_user as regist_user",
        "pr.update_user as update_user",
        "db.dbms_name as db_dbms_name", // DBMS名
        "db.sort as db_sort", // ソート順
        "db.is_deleted as db_is_deleted", // 物理削除
        "db.status as db_status", // 状態
        "DATE_FORMAT(pr.created_at, '%Y/%m/%d %H:%i') as created_at", // 登録日時をフォーマット
        "DATE_FORMAT(pr.updated_at, '%Y/%m/%d %H:%i') as updated_at", // 更新日時をフォーマット
      ]);

      // テーブル結合の設定
      _sqljs.from(["projects pr", "LEFT JOIN dbms db ON pr.dbms_id = db.dbms_id AND db.is_deleted = false"]);

      // 基本条件：有効なレコードのみ
      _sqljs.where("pr.is_deleted = false");

      // オプション条件の追加
      log.debug("auto_where", params);
      _sqljs.autoWhere("pr", params);

      // ソートとページネーションの設定
      _sqljs.lastSql(`order by ${sortKey} ${sortOrder} LIMIT ${pageSize} OFFSET ${offset}`);

      // SQLクエリの実行
      const _sqlInfo = await _sqljs.toFindSql();
      log.debug("find sqlInfo", _sqlInfo);
      const results = await this.dbjs.find(_sqlInfo.sql, _sqlInfo.params);
      const [count, data] = results;

      // 結果の整形と返却
      return {
        rows: data, // 取得したデータ
        total: count, // 総件数
        page, // 現在のページ番号
        pageSize, // 1ページあたりの件数
      };
    } catch (e) {
      // エラーが発生した場合は空の結果を返却
      log.error(e);
      throw e;
    }
  }
}

export default ProjectsDao;
