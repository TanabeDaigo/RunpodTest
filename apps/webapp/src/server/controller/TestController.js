/**
 *
 * KronoMetro
 *
 * Copyright © 2024-present KronoMetro, Co. All rights reserved.
 *
 */
import { injectable } from "tsyringe";
import logjs from "@metrojs/logjs";
import { models, sqljs } from "@lib/server";
import { AbstractObject as Abstract } from "@common/server";

const log = new logjs("TestController");

@injectable()
class TestController extends Abstract {
  // コンストラクタ
  constructor() {
    super();
    log.debug("constructor START!!");
  }

  async test(req, dbjs) {
    log.debug("mode:test", this.params);

    try {
      await dbjs.startTransaction(); // トランザクションを開始

      // テーブル作成
      await dbjs.query(`DROP TABLE IF EXISTS unit_test;`); // unit_testテーブルが存在する場合は削除
      const sql = `
        CREATE TABLE unit_test (
            id                                bigint               UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
            name                              varchar(64)          NOT NULL DEFAULT '' COMMENT '名称', 
            comments                          text                          COMMENT 'コメント',
            is_deleted                        boolean                       DEFAULT false COMMENT '論理削除フラグ',
            dbcount                           int                  NOT NULL DEFAULT 0 COMMENT '更新回数',
            created_at                        timestamp            NOT NULL DEFAULT current_timestamp COMMENT '登録日時',
            registuser                        varchar(32)          NOT NULL DEFAULT '' COMMENT '登録者',
            updated_at                        timestamp            NOT NULL DEFAULT current_timestamp on update current_timestamp COMMENT '更新日時',
            updateuser                        varchar(32)                   DEFAULT NULL COMMENT '更新者',
            
          PRIMARY KEY ( id )
        ) ENGINE=Innodb DEFAULT CHARSET=utf8 comment='テストテーブル';
        `; // unit_testテーブルを作成するSQL
      await dbjs.query(sql); // SQLを実行してテーブルを作成

      await dbjs.truncate("unit_test"); //テーブルを空にする

      const unitTestModel = await new models("unit_test", dbjs, req.session); // unit_testテーブルのモデルを作成

      log.debug(`unitTestModel.insert`);
      let result = await unitTestModel.insert({
        // モデルを使用してデータを挿入
        name: "test_name1",
        comments: "test_comments1",
      });
      log.debug("unitTestModel.insert result", result);

      // データ挿入
      log.debug(`dbjs.insert`);
      result = await dbjs.insert("unit_test", {
        // dbjsを直接使用してデータを挿入
        name: "test_name2",
        comments: "test_comments2",
        registuser: req.session.user.name,
      });
      log.debug("dbjs.insert result", result);

      const lastID = await dbjs.getLastInsertId(); // 最後に挿入されたIDを取得
      log.debug("getLastInsertId lastID", lastID);

      log.debug("dbjs.commit");
      await dbjs.commit(); // トランザクションをコミット

      log.debug("dbjs.update");
      await dbjs.update(
        // データを更新
        "unit_test",
        {
          name: "test_name3",
          comments: "test_comments3",
          registuser: req.session.user.name,
        },
        {
          id: 2,
        }
      );
      log.debug("dbjs.commit");
      await dbjs.commit(); // トランザクションをコミット

      log.debug("dbjs.buildInsertSql");
      const insertSql = await dbjs.buildInsertSql("unit_test", [
        {
          name: "test_name4",
          comments: "test_comments4",
          registuser: req.session.user.name,
        },
        {
          name: "test_name5",
          comments: "test_comments5",
          registuser: req.session.user.name,
        },
      ]);
      log.debug("insert文を作る　buildInsertSql", insertSql);

      log.debug("dbjs.bulk_insert");
      await dbjs.bulkInsert("unit_test", [
        // 複数のデータを一括挿入
        {
          name: "test_name6",
          comments: "test_comments6",
          registuser: req.session.user.name,
        },
        {
          name: "test_name7",
          comments: "test_comments7",
          registuser: req.session.user.name,
        },
      ]);
      await dbjs.commit(); // トランザクションをコミット

      await unitTestModel.delete({
        // モデルを使用してデータを削除
        id: 2,
      });
      await dbjs.commit(); // トランザクションをコミット

      log.debug("dbjs.select");
      let data = await dbjs.select("select * from unit_test"); // 全データを取得
      log.debug("select data", data);

      // SQLクエリビルダーを使用してデータを取得
      log.debug("dbjs.select_sqljs");
      const _sqljs = new sqljs();
      _sqljs.select(["id", "name", "comments", "registuser", "created_at", "updated_at"]);
      _sqljs.from("unit_test");
      _sqljs.where("id >= ?", [1]);
      data = await dbjs.selectSqljs(_sqljs);
      log.debug("selectSqljs data", data);

      return {
        success: true,
        message: "テストテーブルが作成され、データが挿入されました",
        data: data,
      };
    } catch (e) {
      log.error(e);
      await dbjs.rollback();
      throw e;
    }
  }
}

export default TestController;
