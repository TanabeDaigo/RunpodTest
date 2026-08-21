#!/bin/sh

# ====================================================
# キャッシュクリアスクリプト
# ====================================================
# 概要：
# Webアプリケーションのキャッシュをクリアするスクリプト
# pnpmのキャッシュクリアを実行し、アプリケーションの
# キャッシュをリフレッシュします
#
# 機能：
# 1. 指定されたブランチのWebアプリケーションディレクトリに移動
# 2. pnpmのキャッシュクリアコマンドを実行
# 3. 対話モードでの確認（オプション）
#
# 使用方法：
# ./clear_cache.sh [モード]
#   モード: 0 - 通常モード（確認あり）
#          1 - サイレントモード（確認なし）
#
# 例：
# ./clear_cache.sh 0  # 確認ありで実行
# ./clear_cache.sh 1  # 確認なしで実行
#
# 依存ファイル：
# - define.sh: 環境変数定義ファイル
# - .branch_dir_name: ブランチディレクトリ名
# - .branch_name: ブランチ名
#
# 注意事項：
# - 実行前に適切なブランチが選択されていることを確認してください
# - キャッシュクリアはアプリケーションの動作に影響を与える可能性があります
# ====================================================

source ~/.bashrc
source ~/.bash_profile

source define.sh

SELF=${0}
if [ ${#} -le 0 ] ; then
    echo ""
    echo "キャッシュクリア処理"
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


execute(){
  cd ${WEB_APP_DIR}
  pwd
  pnpm run clear-cache
  echo "キャッシュをクリアしました。"
}

if [ $is_question = 0 ]; then
    #echo ${WEB_APP_DIR}
    echo "キャッシュをクリアします。よろしいですか？[Y/n]"
    read ANSER
    case $ANSER in
     "Y" | "y" | "yes" | "Yes" | "YES" ) execute;;
    *) echo 'exit!!' ;;
    esac
else
  execute
fi


