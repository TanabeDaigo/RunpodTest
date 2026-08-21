import { injectable } from "tsyringe";
import AbstractDao from "../AbstractDao";
import { logjs, sqljs, dayjs } from "@lib/server";

const log = new logjs("UsersDao");

/**
 * ユーザー情報を管理するDAOクラス
 * ユーザーの検索、取得などのデータベース操作を担当
 */
@injectable()
class UsersDao extends AbstractDao {
  constructor() {
    super("users");
  }

  /**
   * ユーザー情報を検索・取得する
   * @param {Object} params - 検索パラメータ
   * @param {number} [params.page=1] - ページ番号
   * @param {number} [params.pageSize=100] - 1ページあたりの件数
   * @param {string} [params.sortKey="user_id"] - ソートキー
   * @param {string} [params.sortOrder="desc"] - ソート順序
   * @returns {Object} 検索結果（rows, total, page, pageSize）
   */
  async find(params) {
    log.debug("find params", params);

    // パラメータのデフォルト値を設定
    const {
      page = 1,
      pageSize = 100,
      sortKey = "user_id", // 指定していなければプライマリキーの先頭
      sortOrder = "desc", // 指定していなければ降順
    } = params;

    try {
      // ページネーション用のオフセット計算
      const offset = (page - 1) * pageSize;

      // SQLクエリビルダーの初期化
      const _sqljs = new sqljs();

      // 取得するカラムの指定
      _sqljs.select([
        "us1.user_id as user_id",
        "us1.login_id as login_id",
        "us1.password as password",
        "us1.password_key as password_key",
        "us1.last_name as last_name",
        "us1.user_name as user_name",
        "us1.katakana_last_name as katakana_last_name",
        "us1.katakana_name as katakana_name",
        "us1.mail1 as mail1",
        "us1.is_send_mail1 as is_send_mail1",
        "us1.mail2 as mail2",
        "us1.is_send_mail2 as is_send_mail2",
        "us1.mail3 as mail3",
        "us1.is_send_mail3 as is_send_mail3",
        "us1.incoming_mail_format as incoming_mail_format",
        "us1.sex as sex",
        "us1.post_first_no as post_first_no",
        "us1.post_last_no as post_last_no",
        "us1.province_id as province_id",
        "us1.address1 as address1",
        "us1.address2 as address2",
        "us1.address3 as address3",
        "us1.nearest_station as nearest_station",
        "us1.birthplace as birthplace",
        "us1.nationality as nationality",
        "us1.official_position as official_position",
        "us1.department as department",
        "us1.organization as organization",
        "us1.is_smoking as is_smoking",
        "us1.blood_type as blood_type",
        "us1.is_spouse as is_spouse",
        "us1.comments as comments",
        "us1.auth as auth",
        "us1.login_state as login_state",
        "us1.is_deleted as is_deleted",
        "us1.dbcount as dbcount",
        "us1.regist_user as regist_user",
        "us1.update_user as update_user",

        "DATE_FORMAT(us1.date_of_birth, '%Y/%m/%d %H:%i') as date_of_birth", // 生年月日をフォーマット
        "DATE_FORMAT(us1.first_login_date, '%Y/%m/%d %H:%i') as first_login_date", // 初回ログイン日時をフォーマット
        "DATE_FORMAT(us1.created_at, '%Y/%m/%d %H:%i') as created_at", // 登録日時をフォーマット
        "DATE_FORMAT(us1.updated_at, '%Y/%m/%d %H:%i') as updated_at", // 更新日時をフォーマット
      ]);

      // テーブル結合の設定
      _sqljs.from(["users us1"]);

      // 基本条件：有効なレコードのみ
      _sqljs.where("us1.is_deleted = false");

      // オプション条件の追加
      log.debug("auto_where", params);
      _sqljs.autoWhere("us1", params);

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

export default UsersDao;
