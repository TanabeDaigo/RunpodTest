const MYSQL_SCHEMA_QUERY = `
SELECT 
    -- テーブル名
    TABLE_NAME as table_name,
    -- カラム名
    COLUMN_NAME as column_name,
    -- データ型
    DATA_TYPE as data_type,
    -- 文字列型の場合は最大長を取得、それ以外はNULL
    CASE 
        WHEN DATA_TYPE IN ('varchar', 'char', 'binary', 'varbinary', 'text', 'blob') THEN CHARACTER_MAXIMUM_LENGTH
        ELSE NULL 
    END as max_length,

    -- デフォルト値
    COLUMN_DEFAULT as column_default,
    -- NULL許可フラグ
    IS_NULLABLE as is_nullable,
    -- 主キー情報
    COLUMN_KEY as column_key,
    -- 追加情報(auto_incrementなど)
    EXTRA as extra,
    -- AUTO_INCREMENT情報
    CASE 
        WHEN EXTRA = 'auto_increment' THEN true
        ELSE false
    END as is_auto_increment,
    -- カラムコメント
    COLUMN_COMMENT as column_comment,
    -- 数値型かどうかのフラグ
    CASE
        WHEN DATA_TYPE IN ('tinyint', 'smallint', 'mediumint', 'int', 'bigint', 'float', 'double', 'decimal') THEN true
        ELSE false
    END as is_type_num
FROM information_schema.columns 
WHERE table_schema = '\${database}'
ORDER BY table_name, ordinal_position`;

const POSTGRES_SCHEMA_QUERY = `
SELECT 
    -- テーブル名
    table_name,
    -- カラム名
    column_name,
    -- データ型
    data_type as data_type,
    -- 文字列型の場合は最大長を取得、それ以外はNULL
    CASE 
        WHEN data_type IN ('character varying', 'character', 'text', 'bytea') THEN character_maximum_length
        ELSE NULL 
    END as max_length,

    -- デフォルト値
    column_default as column_default,
    -- NULL許可フラグ
    is_nullable,
    -- 主キー情報
    CASE 
        WHEN pk.contype = 'p' THEN 'PRI'
        ELSE ''
    END as column_key,
    -- 追加情報
    CASE 
        WHEN column_default LIKE 'nextval%' THEN 'auto_increment'
        ELSE ''
    END as extra,
    -- AUTO_INCREMENT情報
    CASE 
        WHEN column_default LIKE 'nextval%' THEN true
        ELSE false
    END as is_auto_increment,
    -- カラムコメント
    col_description(format('%s.%s',table_schema,table_name)::regclass::oid, ordinal_position) as column_comment,
    -- 数値型かどうかのフラグ
    CASE
        WHEN data_type IN ('smallint', 'integer', 'bigint', 'decimal', 'numeric', 'real', 'double precision') THEN true
        ELSE false
    END as is_type_num
FROM information_schema.columns c
LEFT JOIN (
    SELECT conrelid::regclass::text as table_name,
           contype,
           a.attname as column_name
    FROM pg_constraint
    JOIN pg_attribute a ON a.attnum = ANY(conkey) AND a.attrelid = conrelid
    WHERE contype = 'p'
) pk ON pk.table_name = c.table_name AND pk.column_name = c.column_name
WHERE table_schema = '\${database}'
ORDER BY table_name, ordinal_position`;

export const getSchemaQuery = (database, dialect) => {
  if (dialect === "mysql") {
    return MYSQL_SCHEMA_QUERY.replace(/\${database}/g, database);
  } else if (dialect === "postgres") {
    return POSTGRES_SCHEMA_QUERY.replace(/\${database}/g, database);
  } else {
    throw new Error("サポートされていないデータベースダイアレクトです");
  }
};
