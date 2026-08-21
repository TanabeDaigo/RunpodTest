#!/bin/sh

# ====================================================
# アプリケーション停止スクリプト
# ====================================================
# 概要：
# Webアプリケーションを安全に停止するスクリプト
# foreverで実行中のプロセスと、指定ポートを使用している
# プロセスを停止します
#
# 機能：
# 1. foreverで実行中のプロセスの停止（forever stopall）
# 2. ポート3010と3020を使用しているプロセスの確認と停止
#    - 通常終了（kill）を試みる
#    - 応答がない場合は強制終了（kill -9）
# 3. 残存するNode.jsプロセスの強制終了
# 4. プロセス状態の確認と表示
# 5. 対話モードでの確認（オプション）
#
# 使用方法：
# ./stop.sh [モード]
#   モード: 0 - 通常モード（確認あり）
#          1 - サイレントモード（確認なし）
#
# 例：
# ./stop.sh 0  # 確認ありで実行
# ./stop.sh 1  # 確認なしで実行
#
# 依存ファイル：
# - define.sh: 環境変数定義ファイル
#
# 環境変数：
# - ENV_NAME: 環境名
# - WEB_APP_DIR: Webアプリケーションディレクトリ
# - LOG_FILE: ログファイルパス
# - TARGET_PORT: 停止対象ポート（スペース区切りで複数指定可能）※必須
#
# 使用例（環境変数に TARGET_PORT が設定されていることを前提とします）：
#   export TARGET_PORT="3010 3011 3012 3013"
#   ./stop.sh 0  # 確認ありで実行
#   ./stop.sh 1  # 確認なしで実行
#
# 例：
# ./stop.sh 0  # 確認ありで実行
# ./stop.sh 1  # 確認なしで実行
#
# 注意事項：
# - TARGET_PORT が未設定の場合はエラーで終了します# - foreverコマンドが必要です
# - ssコマンドが必要です
# - 実行前にプロセスの状態を確認します
# - 停止対象のプロセスが存在しない場合は終了します
# - 強制終了（kill -9）は最後の手段として使用されます
# - ポート3010と3020を使用しているプロセスに影響があります
# ====================================================

source ~/.bashrc
source ~/.bash_profile
source define.sh

# TARGET_PORT が指定されていなければエラー
if [ -z "$TARGET_PORT" ]; then
    echo ""
    echo "エラー: 環境変数 TARGET_PORT が設定されていません。"
    echo "define.sh または環境に TARGET_PORT=\"3010 3011 3012 3013\" のように設定してください。"
    echo ""
    exit 1
fi
SELF=${0}
if [ ${#} -le 0 ] ; then
    echo ""
    echo "Stop処理"
    echo ""
    echo "下記、引数を指定してください。"
    echo "  第１引数： 0:通常 1:問い合わせなし"
    echo ""
    echo "     例："${SELF}" 0"
    echo ""
    exit 1;
fi

is_question=${1}

_TARGET_PORT=${TARGET_PORT// /|}
execute (){

  cd $WEB_APP_DIR

  echo "-------------------------------------------------"
  echo ${ENV_NAME}"環境を停止します。"$WEB_APP_DIR

  forever stopall

  # ポート3010または3020を使用しているプロセスを確認
  for PORT in ${TARGET_PORT[@]} ; do
    PID=$(ss -tulpn | grep ":$PORT" | grep -o "pid=[0-9]*" | cut -d'=' -f2)

    if [ ! -z "$PID" ]; then
        echo "ポート${PORT}を使用しているプロセス(PID: $PID)を停止します"
        # まず通常の終了を試みる
        kill $PID
        sleep 2
        # プロセスが残っている場合は強制終了
        if ps -p $PID > /dev/null; then
            echo "プロセスが応答しないため、強制終了します"
            kill -9 $PID
        fi
        echo "ポート${PORT}のプロセスを停止しました"
    else
        echo "ポート${PORT}を使用しているプロセスはありません"
    fi
  done

  # 残プロセスがあればKillする（自ユーザーの node プロセスのみ対象・他ユーザー/システムは触らない）
  pkill -9 -u "$(whoami)" -f node 2>/dev/null || true

  echo "forever list ------------------------------------"
  forever list
  echo ""
  echo "ps aux ------------------------------------------"
  ps aux | grep node | grep -v grep 
  echo ""

  echo "use port ----------------------------------------"
  ss -tulpn | grep -E  ${_TARGET_PORT} 

}


echo ${ENV_NAME}"環境:"${WEB_APP_DIR}

echo "LOG_FILE:"$LOG_FILE
echo "PORT:"$TARGET_PORT

echo "forever list -------------------------------------------------"
forever list | grep $LOG_FILE
echo ""
echo "ps aux -------------------------------------------------"
ps ax | grep node | grep -v grep 
echo ""
  echo "use port ----------------------------------------"
  PORT=${TARGET_PORT// /|}
  echo "port:"$PORT
  #ss -tulpn | grep -E '3010|3011|3012'
  ss -tulpn | grep -E ${_TARGET_PORT}

count=`ps aux | grep node | grep -v grep | wc -l`;
#port_count=`ss -tulpn | grep -E '3010|3011|3012' | wc -l`;
port_count=`ss -tulpn | grep -E ${_TARGET_PORT} | wc -l`;

  echo "対象Port件数:"$port_count

if [ $count -le 0 ] && [ $port_count -le 0 ]; then
  echo "停止対象のプロセスが存在しません。";
  exit
fi 
if [ $is_question = 0 ]; then

  echo ${ENV_NAME}"環境を停止します。よろしいですか？[Y/n]"
  read ANSER

  case $ANSER in
   "Y" | "y" | "yes" | "Yes" | "YES" ) execute;;
   *) echo 'exit!!' ;;
  esac
else
  execute
fi



