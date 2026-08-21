import { injectable } from "tsyringe";
import AbstractDao from "../AbstractDao";
import { logjs, sqljs, dayjs } from "@lib/server";

const log = new logjs("AutoMakeItemsDao");

/**
 * 自動作成アイテム情報を管理するDAOクラス
 * 自動作成アイテムの検索、取得などのデータベース操作を担当
 */
@injectable()
class AutoMakeItemsDao extends AbstractDao {
  constructor() {
    super("auto_make_items");
  }

  /**
   * 自動作成アイテム情報を検索・取得する
   * @param {Object} params - 検索パラメータ
   * @param {number} [params.page=1] - ページ番号
   * @param {number} [params.pageSize=100] - 1ページあたりの件数
   * @param {string} [params.sortKey="auto_make_items_id"] - ソートキー
   * @param {string} [params.sortOrder="desc"] - ソート順序
   * @returns {Object} 検索結果（rows, total, page, pageSize）
   */
  async find(params) {
    log.debug("find params", params);

    // パラメータのデフォルト値を設定
    const {
      page = 1,
      pageSize = 100,
      sortKey = "auto_make_items_id", // 指定していなければプライマリキーの先頭
      sortOrder = "desc", // 指定していなければ降順
    } = params;

    try {
      // ページネーション用のオフセット計算
      const offset = (page - 1) * pageSize;

      // SQLクエリビルダーの初期化
      const _sqljs = new sqljs();

      // 取得するカラムの指定
      _sqljs.select([
        "au.auto_make_items_id as auto_make_items_id",
        "au.project_id as project_id",
        "au.title as title",
        "au.dir_name as dir_name",
        "au.url as url",
        "au.table_name as table_name",
        "au.contents as contents",
        "au.sort as sort",
        "au.is_deleted as is_deleted",
        "au.dbcount as dbcount",
        "au.regist_user as regist_user",
        "au.update_user as update_user",

        "DATE_FORMAT(au.created_at, '%Y/%m/%d %H:%i') as created_at", // 登録日時をフォーマット
        "DATE_FORMAT(au.updated_at, '%Y/%m/%d %H:%i') as updated_at", // 更新日時をフォーマット
      ]);

      // テーブル結合の設定
      _sqljs.from(["auto_make_items au"]);

      // 基本条件：有効なレコードのみ
      _sqljs.where("au.is_deleted = false");

      // オプション条件の追加
      log.debug("auto_where", params);
      _sqljs.autoWhere("au", params);

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

export default AutoMakeItemsDao;
