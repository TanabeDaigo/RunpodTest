#!/bin/bash

# ====================================================
# メール送信スクリプト
# ====================================================
# 概要：
# KronometroのAWS SES APIを使用してメールを送信するスクリプト
# システムからの通知やアラートメールの送信に使用
#
# 機能：
# 1. 指定された宛先、件名、メッセージでメールを送信
# 2. AWS SES APIを使用した安全なメール送信
# 3. 送信結果のログ出力
#
# 使用方法：
# _sendmail [宛先] [件名] [メッセージ]
#   宛先: メール送信先のアドレス
#   件名: メールの件名
#   メッセージ: メールの本文
#
# 例：
# _sendmail "user@example.com" "テストメール" "これはテストメールです。"
#
# 依存サービス：
# - Kronometro AWS SES API
#   URL: https://api.kronometro.co.jp/api/awsses.php
#
# 環境変数：
# - なし（APIキーはスクリプト内にハードコード）
#
# 注意事項：
# - APIキーがスクリプト内にハードコードされています
# - メッセージはURLエンコードされます
# - 送信元アドレスは固定（alert@kronometro.jp）
# - curlコマンドが必要です
# - インターネット接続が必要です
# ====================================================

function _sendmail(){
  echo "sendmail --------------------"

  local _to=$1 # 配信先
  local _subject=$2 # タイトル
  local _message=$3 # メッセージ

  echo "sendmail to:"${_to}" subject:"${_subject}
  echo "message:"${_message}


  curl -v \
       -H "x-api-key: nlgOV1dg06oPgXXMDHcWkMigRrD1S0X3c157OeDn0blDymJyHbHQsmzPHtEbs934" \
       -X POST \
       --data-urlencode "addTo=${_to}" \
       --data-urlencode "setFrom=alert@kronometro.jp" \
       --data-urlencode "setSubject=${_subject}" \
       --data-urlencode "setMessageFromString=${_message}" \
       "https://api.kronometro.co.jp/api_9eAd/awsses.php"



}

# スクリプトが直接実行された場合のみ実行
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
  _sendmail $1 $2 $3
fi