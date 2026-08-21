#!/bin/sh

# ====================================================
# Webアプリケーションシンボリックリンク切り替えスクリプト
# ====================================================
# 概要：
# 指定されたブランチのWebアプリケーションディレクトリを
# システムのwebappシンボリックリンクに切り替えるスクリプト
#
# 機能：
# 1. 既存のwebappシンボリックリンクの削除
# 2. 指定ブランチのディレクトリへの新しいシンボリックリンク作成
# 3. 対話モードでの確認（オプション）
#
# 使用方法：
# ./link_webapp.sh [モード]
#   モード: 0 - 通常モード（確認あり）
#          1 - サイレントモード（確認なし）
#
# 例：
# ./link_webapp.sh 0  # 確認ありで実行
# ./link_webapp.sh 1  # 確認なしで実行
#
# 依存ファイル：
# - define.sh: 環境変数定義ファイル
# - .branch_dir_name: ブランチディレクトリ名
# - .branch_name: ブランチ名
#
# 環境変数：
# - SYSTEM_DIR: システムディレクトリ
# - WEB_APP_DIR: Webアプリケーションディレクトリ
# - APP_DIR: アプリケーションディレクトリ
#
# 注意事項：
# - 実行前に適切なブランチが選択されていることを確認してください
# - 既存のwebappシンボリックリンクは自動的に削除されます
# - システムのwebappディレクトリへの書き込み権限が必要です
# - 切り替え後はWebサーバーの再起動が必要な場合があります
# ====================================================

source ~/.bashrc
source ~/.bash_profile

source define.sh

# source sendmail.sh


SELF=${0}
if [ ${#} -le 0 ] ; then
    echo ""
    echo "webapp を リンク先の切り替え "
    echo ""
    echo "下記、引数を指定してください。"
    echo "  第１引数：0:通常 1:問い合わせなし"
    echo ""
    echo "     例："${SELF}" 0"
    echo ""
    exit 1;
fi

target_branch=`cat ${SBIN_DIR}/.branch_dir_name`
branch_name=`cat ${SBIN_DIR}/.branch_name`
target_dir=$APP_DIR"/"${target_branch}

is_question=${1}

execute () {

  cd ${SYSTEM_DIR}

  if [ -L ${WEB_APP_DIR} ]; then
    echo "削除します。"
   unlink ./webapp
  fi

  pwd
  ls -la
  echo "webappをリンクします。"
  ln -sv $target_dir webapp

  # メール送信
  sendmail.sh $MAIL_TO "【${ENV_NAME}】webapp切り替え"  "webapp切り替え--branch:${branch_name}に切り替えました。"

  pwd
  ls -al


}


if [ $is_question = 0 ]; then
  
  echo $branch_name
  echo "webappのリンク先を切り替えます。よろしいですか？[Y/n]"
  read ANSER
  case $ANSER in
   "Y" | "y" | "yes" | "Yes" | "YES" ) execute;;
  *) echo 'exit!!' ;;
  esac
else
  execute
fi




