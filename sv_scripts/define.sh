#!/bin/sh

#環境変数読みこみ
source ~/.bashrc
source ~/.bash_profile

# シェル実行用定数
# 環境によって要変更

## ==================== 共通項目

hostname=`hostname`
#echo "hostname:"$hostname

# 設置ディレクトリ
SYSTEM_DIR="/var/${SYSTEM_NAME}"
APP_DIR="${SYSTEM_DIR}/app"
WEB_APP_DIR="${SYSTEM_DIR}/${PROJECT_NAME}"
SBIN_DIR="${SYSTEM_DIR}/sbin/sv_scripts"
# 現在稼働中のbranch
ACTIVE_BRANCH=`cat ${SBIN_DIR}/.branch_name`
APP_USER=${USER_NAME}

if [ $IS_STAGING = true ]; then
  LOG_DIR="${SYSTEM_DIR}/logs/testing"
else
  LOG_DIR="${SYSTEM_DIR}/logs/production"
fi
SCRIPTS_LOG_DIR="${SYSTEM_DIR}/logs/sv_scripts"

# ログディレクトリが存在しない場合は作成
mkdir -p "${LOG_DIR}"
mkdir -p "${SCRIPTS_LOG_DIR}"

# ログファイル設定
# LOG_FILE_xxxx: 監視対象ファイル
LOG_FILE_WEBAPP="${LOG_DIR}/forever.webapp.log"



# GIT情報
GIT_PASS="metrojs1203"
GIT_REPO="Krono-Metro/metrojs.git"
GIT_HTTP_URL="https://github.com/"${GIT_REPO}
GIT_URL="git@github.com:"${GIT_REPO}

# メール送信設定
# メールのタイトルは、SH_APPLICATION[実行環境名]SH_SUBJECT　となります
MAIL_TO="alert_metrojs@kronometro.co.jp"
MAIL_FROM="alert@kronometro.jp"
SUBJECT_APP=$SERVICE_NAME
MAIL_SUBJECT="error"
MAIL_ERROR_CONDITIONS="error" # ログエラー検知条件




#echo "hostname:"$hostname
#echo "IS_STAGING:"$IS_STAGING
#echo "IS_DB_SERVER:"$IS_DB_SERVER
#echo "ENV_NAME:"$ENV_NAME
#echo "SERVICE_NAME:"$SERVICE_NAME
#echo "SYSTEM_NAME:"$SYSTEM_NAME
#echo "SYSTEM_DIR:"$SYSTEM_DIR
echo "ACTIVE_BRANCH:"$ACTIVE_BRANCH
#echo "LOG_DIR:"$LOG_DIR
#echo "LOG_FILE:"$LOG_FILE
#echo "GIT_PASS:"$GIT_PASS
#echo "GIT_REPO:"$GIT_REPO
#echo "GIT_HTTP_URL:"$GIT_HTTP_URL
#echo "GIT_URL:"$GIT_URL



