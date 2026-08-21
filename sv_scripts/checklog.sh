#!/bin/bash

# ====================================================
# ログチェックスクリプト
# ====================================================
# 概要：
# 指定されたログファイルを監視し、エラー条件に一致する
# ログエントリを検出した場合にメール通知を行うスクリプト
#
# 機能：
# 1. ログファイルの存在確認
# 2. エラー条件に基づくログチェック
# 3. エラー検出時のログファイルバックアップ
# 4. エラー検出時のメール通知
#
# 使用方法：
# ./checklog.sh
#
# 依存ファイル：
# - define.sh: 環境変数定義ファイル
# - sendmail.sh: メール送信用スクリプト
#
# 設定項目：
# - MAIL_TO: メール送信先
# - MAIL_FROM: メール送信元
# - SUBJECT_APP: アプリケーション名
# - MAIL_SUBJECT: メール件名
# - MAIL_ERROR_CONDITIONS: エラー検出条件
# - LOG_FILE_BUYER: 監視対象ログファイル（buyer）
# - LOG_FILE_SELLER: 監視対象ログファイル（seller）
# ====================================================

#環境変数読みこみ
source ~/.bash_profile
source ~/.bashrc

source define.sh

# メール送信設定
_to=$MAIL_TO
_from=$MAIL_FROM

# メール件名設定
_application=$SUBJECT_APP
_subject=$MAIL_SUBJECT

# エラー条件
_error_conditions=$MAIL_ERROR_CONDITIONS

# ログファイル配列
LOG_FILES=("$LOG_FILE_WEBAPP")
LOG_NAMES=($TARGET_LOG)

if [ -z "${TARGET_LOG:-}" ]; then
  echo "エラー: TARGET_LOG が設定されていません。環境変数(.bash_profile) で TARGET_LOG を設定してください。" >&2
  exit 1
fi

# ログファイルコピー関数
function copyLogFile(){
  local log_file=$1
  local now=`date +%Y%m%d%H%M%S`
  echo "ログファイルをコピーします。LOG_FILE:"$log_file.$now
  cp -p $log_file $log_file.$now"_error"
  cp /dev/null $log_file
}

# ログチェック関数
function checkLogFile(){
  local log_file=$1
  local log_name=$2
  
  echo
  echo "----------------------------------------"
  echo "ログファイルをチェックします。LOG_FILE:"$log_file" (${log_name})"
  
  if [ ! -e "$log_file" ]; then
    echo "ログファイルが存在しません。LOG_FILE:"$log_file
    return
  fi
  
  # エラー行を配列で取得（Forever SIGKILL / Script restart attempt / script exited with code は無視）
  mapfile -t ERR_LINES < <(grep -v "error_message" "$log_file" \
    | grep -v '{"level":"error","message":"Forever detected script was killed by signal: SIGKILL"}' \
    | grep -v '{"level":"error","message":"Script restart attempt' \
    | grep -v '{"level":"error","message":"Forever detected script exited with code:' \
    | grep "${_error_conditions}")
  
  if [ ${#ERR_LINES[@]} -gt 0 ]; then
    now=$(date +%Y%m%d%H%M%S)
    copyLogFile "$log_file" #ログファイルをコピー＆クリア
    
    echo 'ログにエラー検出しました。メール送信します。' 
    _title="${_application} [${ENV_NAME}] ${_subject}"
    
    # RESULT を1行で作る
    RESULT=''
    for LINE in "${ERR_LINES[@]}"; do
      RESULT+="$LINE ($log_name) "
    done
    
    # メール本文作成
    NL=$'\r\n'
    msg=''
    msg+="エラーが検知されました。"$NL
    msg+="ログファイル: ${log_file}"$NL
    msg+="---"$NL
    msg+="${RESULT}"$NL
    msg+="---"$NL
    msg+="${log_file}.${now}"$NL
    msg+=$NL
    msg+="上記ログを確認のうえ、必要があれば対処をお願いします。"$NL
    
    echo "msg:"$msg
    
    source sendmail.sh 
    _sendmail "$_to" "$_title" "$msg"
  else
    echo 'ログにエラーはありませんでした。'
  fi
  
  echo "----------------------------------------"
}

echo
echo "===================================================="
echo 'ログチェックを開始します。'`date +%Y/%m/%d_%H:%M:%S` 

# 各ログファイルに対してチェック処理を実行
for i in "${!LOG_FILES[@]}"; do

  echo "${LOG_FILES[$i]} - ${LOG_NAMES[$i]}"

  if [[ "${LOG_FILES[$i]}" == *"${LOG_NAMES[$i]}"* ]]; then
    checkLogFile "${LOG_FILES[$i]}" "${LOG_NAMES[$i]}"
  fi
done

echo
echo "===================================================="
echo 'ログチェックを終了します。'`date +%Y/%m/%d_%H:%M:%S` 
echo
