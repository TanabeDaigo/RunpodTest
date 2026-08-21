import { injectable } from "tsyringe";
import AbstractDao from "../AbstractDao";
import { logjs, sqljs, dayjs } from "@lib/server";

const log = new logjs("AutoMakeTestDao");

/**
 * 自動作成テスト情報を管理するDAOクラス
 * 自動作成テストの検索、取得などのデータベース操作を担当
 */
@injectable()
class AutoMakeTestDao extends AbstractDao {
  constructor() {
    super("auto_make_test");
  }

  /**
   * 自動作成テスト情報を検索・取得する
   * @param {Object} params - 検索パラメータ
   * @param {number} [params.page=1] - ページ番号
   * @param {number} [params.pageSize=100] - 1ページあたりの件数
   * @param {string} [params.sortKey="id"] - ソートキー
   * @param {string} [params.sortOrder="desc"] - ソート順序
   * @returns {Object} 検索結果（rows, total, page, pageSize）
   */
  async find(params) {
    log.debug("find params", params);

    // パラメータのデフォルト値を設定
    const {
      page = 1,
      pageSize = 100,
      sortKey = "id", // 指定していなければプライマリキーの先頭
      sortOrder = "desc", // 指定していなければ降順
    } = params;

    try {
      // ページネーション用のオフセット計算
      const offset = (page - 1) * pageSize;

      // SQLクエリビルダーの初期化
      const _sqljs = new sqljs();

      // 取得するカラムの指定
      _sqljs.select([
        "au.id as id",
        "au.int_col as int_col",
        "au.smallint_col as smallint_col",
        "au.tinyint_col as tinyint_col",
        "au.mediumint_col as mediumint_col",
        "au.decimal_col as decimal_col",
        "au.numeric_col as numeric_col",
        "au.float_col as float_col",
        "au.double_col as double_col",
        "au.date_col as date_col",
        "au.time_col as time_col",
        "au.year_col as year_col",
        "au.char_col as char_col",
        "au.varchar_col as varchar_col",
        "au.binary_col as binary_col",
        "au.varbinary_col as varbinary_col",
        "au.blob_col as blob_col",
        "au.text_col as text_col",
        "au.is_deleted as is_deleted",
        "au.dbcount as dbcount",
        "au.regist_user as regist_user",
        "au.update_user as update_user",

        "DATE_FORMAT(au.datetime_col, '%Y/%m/%d %H:%i') as datetime_col", // datetime型をフォーマット
        "DATE_FORMAT(au.timestamp_col, '%Y/%m/%d %H:%i') as timestamp_col", // timestamp型をフォーマット
        "DATE_FORMAT(au.created_at, '%Y/%m/%d %H:%i') as created_at", // 登録日時をフォーマット
        "DATE_FORMAT(au.updated_at, '%Y/%m/%d %H:%i') as updated_at", // 更新日時をフォーマット
      ]);

      // テーブル結合の設定
      _sqljs.from(["auto_make_test au"]);

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

export default AutoMakeTestDao;
