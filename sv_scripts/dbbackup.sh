#!/bin/bash

# ====================================================
# データベースバックアップスクリプト
# ====================================================
# 概要：
# 指定されたデータベースのバックアップを取得し、
# 古いバックアップファイルを自動的に削除するスクリプト
#
# 機能：
# 1. PostgreSQLまたはMySQLデータベースのバックアップ
# 2. バックアップファイルの圧縮（gzip）
# 3. 指定期間を超えた古いバックアップの自動削除
# 4. ステージング環境と本番環境の区別
#
# 使用方法：
# ./dbbackup.sh [保持日数]
#   保持日数: バックアップを保持する日数（デフォルト: 7日）
#
# 例：
# ./dbbackup.sh 7  # 7日間バックアップを保持
# ./dbbackup.sh    # デフォルト（7日）で実行
#
# 環境変数：
# - DB_TYPE: データベースタイプ（postgres/mysql）
# - DB_NAME: データベース名
# - IS_STAGING: ステージング環境フラグ
# - SYSTEM_NAME: システム名
# - SYSTEM_DIR: システムディレクトリ
#
# バックアップファイル形式：
# - 本番環境: dbbackup{YYYYMMDD}.dmp.gz
# - ステージング環境: dbbackup{YYYYMMDD}_test.dmp.gz
#
# 注意事項：
# - バックアップは ${SYSTEM_DIR}/backup ディレクトリに保存されます
# - 古いバックアップは自動的に削除されます
# - データベースの種類に応じて適切なバックアップコマンドが選択されます
# ====================================================

source ~/.bash_profile

cd /var/${SYSTEM_NAME}/sbin/sv_scripts
source define.sh

# デフォルト値の設定
DB_TYPE=${DB_TYPE:-"mysql"}  # デフォルトはPostgreSQL
KEEP_DAYS=${1:-7}  # 引数が指定されていない場合は7日

# データベース名の設定
if [ $IS_STAGING = true ]; then
  DB_NAME=${DB_NAME:-"${SYSTEM_NAME}_db_test"}
else
  DB_NAME=${DB_NAME:-"${SYSTEM_NAME}_db"}
fi

cd ${SYSTEM_DIR}/backup

echo "staging: ${IS_STAGING}"
echo "DBタイプ: ${DB_TYPE}"
echo "DB名: ${DB_NAME}"
echo "バックアップ保持期間: ${KEEP_DAYS}日"

echo "DBのバックアップを開始します。"

# バックアップファイル名の生成
BACKUP_DATE=$(date '+%Y%m%d')
if [ $IS_STAGING = true ]; then
  BACKUP_FILE="db_backup${BACKUP_DATE}_test"
else
  BACKUP_FILE="db_backup${BACKUP_DATE}"
fi

# データベースタイプに応じたバックアップ実行
if [ "$DB_TYPE" = "postgres" ]; then
  pg_dump ${DB_NAME} -U ${SYSTEM_NAME} > ${BACKUP_FILE}.dmp
elif [ "$DB_TYPE" = "mysql" ]; then
  mysqldump --no-tablespaces ${DB_NAME}  > ${BACKUP_FILE}.dmp
else
  echo "エラー: サポートされていないデータベースタイプです: ${DB_TYPE}"
  exit 1
fi

# バックアップファイルの圧縮
gzip ${BACKUP_FILE}.dmp

echo "DBのバックアップが完了しました。"

echo "古いバックアップの削除 KEEP_DAYS:${KEEP_DAYS}"
CUTOFF=$(date --date "${KEEP_DAYS} days ago" '+%Y%m%d')
shopt -s nullglob
for f in db_backup*.dmp.gz; do
  if [[ "$f" =~ ^db_backup([0-9]{8})(_test)?\.dmp\.gz$ ]]; then
    file_date="${BASH_REMATCH[1]}"
    if [ "${file_date}" -le "${CUTOFF}" ]; then
      echo "削除: $f"
      rm -f "$f"
    fi
  fi
done
shopt -u nullglob

ls -la
exit


