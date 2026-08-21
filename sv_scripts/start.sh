#!/bin/sh

# ====================================================
# アプリケーション起動スクリプト
# ====================================================
# 概要：
# Webアプリケーションを起動するスクリプト
# foreverを使用してNode.jsアプリケーションを
# デーモンとして起動し、ログを監視します
#
# 機能：
# 1. 既存のプロセスの停止（forever stopall）
# 2. 環境に応じた起動コマンドの実行
#    - 本番環境: pnpm run start:prod
#    - ステージング環境: pnpm run start:staging
# 3. ログファイルの監視
# 4. 対話モードでの確認（オプション）
#
# 使用方法：
# ./start.sh [モード]
#   モード: 0 - 通常モード（確認あり）
#          1 - サイレントモード（確認なし）
#          2 - systemctlモード（確認なし）
#
# 例：
# ./start.sh 0  # 確認ありで実行
# ./start.sh 1  # 確認なしで実行
# ./start.sh 2  # 確認なしで実行 tail なし
#
# 依存ファイル：
# - define.sh: 環境変数定義ファイル
# - .branch_dir_name: ブランチディレクトリ名
# - .branch_name: ブランチ名
#
# 環境変数：
# - ENV_NAME: 環境名
# - IS_STAGING: ステージング環境フラグ
# - WEB_APP_DIR: Webアプリケーションディレクトリ
# - LOG_FILE: ログファイルパス
#
# 注意事項：
# - foreverコマンドが必要です
# - 実行前に適切なブランチが選択されていることを確認してください
# - 既存のプロセスは自動的に停止されます
# - ログファイルは自動的に作成されます
# - アプリケーションの起動には時間がかかる場合があります
# ====================================================

source ~/.bashrc
source ~/.bash_profile
source define.sh

SELF=${0}
if [ ${#} -le 0 ] ; then
    echo ""
    echo "Start処理"
    echo ""
    echo "下記、引数を指定してください。"
    echo "  第１引数： 0:通常 1:問い合わせなし 2:tailなし"
    echo ""
    echo "     例："${SELF}" 0"
    echo ""
    exit 1;
fi

is_question=${1}

target_branch=`cat ${SBIN_DIR}/.branch_dir_name`
branch_name=`cat ${SBIN_DIR}/.branch_name`
target_dir=$APP_DIR"/"${target_branch}

execute (){
  cd ${WEB_APP_DIR}

  echo "-------------------------------------------------"
  echo ${ENV_NAME}"環境を起動します。"${WEB_APP_DIR}

  # 既存のプロセスを停止
  echo "既存のプロセスを停止"
  stop.sh 1
  sleep 2  # プロセスが完全に停止するまで待機

  echo "LOG_FILE:"$LOG_FILE


  echo "-------------------------------------------------"
  
  if [ ${IS_STAGING} = false ]; then
    forever start -a -l ${LOG_FILE} --minUptime 1000 --spinSleepTime 1000 -c "pnpm run start" ./
  else
    forever start -a -l ${LOG_FILE} --minUptime 1000 --spinSleepTime 1000 -c "pnpm run start:staging" ./
  fi
  if [ $is_question != 2 ]; then
    tail -f ${LOG_FILE}
  fi
  
  echo "-------------------------------------------------"
}

echo ${ENV_NAME}"環境:"${WEB_APP_DIR}

if [ $is_question = 0 ]; then

  echo ${ENV_NAME}"環境を起動します。よろしいですか？[Y/n]"
  read ANSER

  case $ANSER in
   "Y" | "y" | "yes" | "Yes" | "YES" ) execute;;
   *) echo 'exit!!' ;;
  esac

else
  execute
fi

