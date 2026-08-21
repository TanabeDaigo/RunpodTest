import { jest } from "@jest/globals";
import sqljs from "../sqljs.js";

describe("sqljs", () => {
  let sql;

  beforeEach(() => {
    sql = new sqljs();
    jest.clearAllMocks();
  });

  describe("from", () => {
    it("テーブル名を設定できること", async () => {
      sql.from("users");
      const sqlString = await sql.toSql();
      process.stdout.write(`SQL: ${sqlString}\n`);
      // pnpm test src/server/__test__/sqljs.test.js　--silent=false
      expect(sqlString).toBe("  SELECT   *   FROM users    ");
    });
    /*
    it("配列で指定した場合、最後のテーブル名が使用されること", () => {
      sql.from(["users"]);
      console.log(sql.toSql());
      expect(sql.toSql()).toBe("SELECT * FROM users");
    });
    */
  });

  /*
  describe("where", () => {
    it("WHERE句を追加できること", () => {
      sql.from("users").where("id = ?", [1]);
      expect(sql.toSql()).toBe("SELECT * FROM users WHERE id = ?");
      expect(sql.getParams()).toEqual([1]);
    });

    it("複数のWHERE句を追加できること", () => {
      sql.from("users").where("id = ?", [1]).where("name = ?", ["山田太郎"]);
      expect(sql.toSql()).toBe("SELECT * FROM users WHERE id = ? AND name = ?");
      expect(sql.getParams()).toEqual([1, "山田太郎"]);
    });
  });
*/
  /*
  describe("orderBy", () => {
    it("ORDER BY句を追加できること", () => {
      sql.from("users").orderBy("id DESC");
      expect(sql.toSql()).toBe("SELECT * FROM users ORDER BY id DESC");
    });

    it("複数のORDER BY句を追加できること", () => {
      sql.from("users").orderBy("id DESC, name ASC");
      expect(sql.toSql()).toBe(
        "SELECT * FROM users ORDER BY id DESC, name ASC"
      );
    });
  });
*/
  /*
  describe("limit", () => {
    it("LIMIT句を追加できること", () => {
      sql.from("users").limit(10);
      expect(sql.toSql()).toBe("SELECT * FROM users LIMIT 10");
    });

    it("OFFSETを指定できること", () => {
      sql.from("users").limit(10, 20);
      expect(sql.toSql()).toBe("SELECT * FROM users LIMIT 10 OFFSET 20");
    });
  });
*/
  /*
  describe("toSql", () => {
    it("カウントクエリを生成できること", () => {
      sql.from("users").where("id = ?", [1]);
      expect(sql.toSql(true)).toBe(
        "SELECT COUNT(*) AS count FROM users WHERE id = ?"
      );
    });

    it("デバッグモードでSQL文を生成できること", () => {
      sql.from("users").where("id = ?", [1]);
      expect(sql.toSql(false, true)).toBe("SELECT * FROM users WHERE id = ?");
    });
  });
*/
  /*
  describe("getParams", () => {
    it("パラメータを取得できること", () => {
      sql.from("users").where("id = ?", [1]).where("name = ?", ["山田太郎"]);
      expect(sql.getParams()).toEqual([1, "山田太郎"]);
    });

    it("パラメータが空の場合、空の配列を返すこと", () => {
      sql.from("users");
      expect(sql.getParams()).toEqual([]);
    });
  });
  */
  /*
  describe("autoWhere", () => {
    it("単一の条件を追加できること", () => {
      sql.from("users").autoWhere({ id: 1 });
      expect(sql.toSql()).toBe("SELECT * FROM users WHERE id = ?");
      expect(sql.getParams()).toEqual([1]);
    });

    it("複数の条件を追加できること", () => {
      sql.from("users").autoWhere({ id: 1, name: "山田太郎" });
      expect(sql.toSql()).toBe("SELECT * FROM users WHERE id = ? AND name = ?");
      expect(sql.getParams()).toEqual([1, "山田太郎"]);
    });

    it("null値の条件を追加できること", () => {
      sql.from("users").autoWhere({ status: null });
      expect(sql.toSql()).toBe("SELECT * FROM users WHERE status IS NULL");
      expect(sql.getParams()).toEqual([]);
    });

    it("配列の条件を追加できること", () => {
      sql.from("users").autoWhere({ id: [1, 2, 3] });
      expect(sql.toSql()).toBe("SELECT * FROM users WHERE id IN (?, ?, ?)");
      expect(sql.getParams()).toEqual([1, 2, 3]);
    });

    it("比較演算子を含む条件を追加できること", () => {
      sql.from("users").autoWhere({ age: { $gt: 20 } });
      expect(sql.toSql()).toBe("SELECT * FROM users WHERE age > ?");
      expect(sql.getParams()).toEqual([20]);
    });

    it("複数の比較演算子を含む条件を追加できること", () => {
      sql.from("users").autoWhere({
        age: { $gt: 20, $lt: 30 },
        status: 1,
      });
      expect(sql.toSql()).toBe(
        "SELECT * FROM users WHERE age > ? AND age < ? AND status = ?"
      );
      expect(sql.getParams()).toEqual([20, 30, 1]);
    });

    it("LIKE演算子を含む条件を追加できること", () => {
      sql.from("users").autoWhere({ name: { $like: "%山田%" } });
      expect(sql.toSql()).toBe("SELECT * FROM users WHERE name LIKE ?");
      expect(sql.getParams()).toEqual(["%山田%"]);
    });

    it("NOT演算子を含む条件を追加できること", () => {
      sql.from("users").autoWhere({ status: { $not: 0 } });
      expect(sql.toSql()).toBe("SELECT * FROM users WHERE status != ?");
      expect(sql.getParams()).toEqual([0]);
    });

    it("NOT IN演算子を含む条件を追加できること", () => {
      sql.from("users").autoWhere({ id: { $notIn: [1, 2, 3] } });
      expect(sql.toSql()).toBe("SELECT * FROM users WHERE id NOT IN (?, ?, ?)");
      expect(sql.getParams()).toEqual([1, 2, 3]);
    });

    it("複雑な条件を組み合わせられること", () => {
      sql.from("users").autoWhere({
        age: { $gt: 20, $lt: 30 },
        status: 1,
        name: { $like: "%山田%" },
        id: { $notIn: [1, 2, 3] },
      });
      expect(sql.toSql()).toBe(
        "SELECT * FROM users WHERE age > ? AND age < ? AND status = ? AND name LIKE ? AND id NOT IN (?, ?, ?)"
      );
      expect(sql.getParams()).toEqual([20, 30, 1, "%山田%", 1, 2, 3]);
    });
  });
  */
});
