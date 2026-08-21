#!/bin/sh

# ====================================================
# アプリケーションコンパイルスクリプト
# ====================================================
# 概要：
# 指定されたブランチのアプリケーションをコンパイルするスクリプト
# データベーススキーマの生成とビルドを実行します
#
# 機能：
# 1. データベーススキーマの生成（pnpm run gen:db）
# 2. 環境に応じたビルド実行
#    - 本番環境: pnpm run build:prod
#    - ステージング環境: pnpm run build:staging
# 3. ファイルの所有者設定
# 4. 対話モードでの確認（オプション）
#
# 使用方法：
# ./compile.sh [モード]
#   モード: 0 - 通常モード（確認あり）
#          1 - サイレントモード（確認なし）
#
# 例：
# ./compile.sh 0  # 確認ありで実行
# ./compile.sh 1  # 確認なしで実行
#
# 依存ファイル：
# - define.sh: 環境変数定義ファイル
# - .branch_dir_name: ブランチディレクトリ名
# - .branch_name: ブランチ名
#
# 環境変数：
# - ENV_NAME: 環境名
# - IS_STAGING: ステージング環境フラグ
# - APP_USER: アプリケーションユーザー
# - APP_DIR: アプリケーションディレクトリ
#
# 注意事項：
# - 実行前に適切なブランチが選択されていることを確認してください
# - コンパイルには時間がかかる場合があります
# - 本番環境とステージング環境で異なるビルドコマンドが実行されます
# ====================================================

source ~/.bashrc
source ~/.bash_profile
source define.sh

SELF=${0}
if [ ${#} -le 0 ] ; then
    echo ""
    echo "Compile処理"
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


BRANCH_DIR=${target_dir}

execute (){

  cd ${BRANCH_DIR}

  #echo "キャッシュクリア"
  #clear_cache.sh 1

  echo "-------------------------------------------------"
  echo ${ENV_NAME}"環境をコンパイルをします。"$BRANCH_DIR

  echo "データベーススキーマの生成"
  if [ ${IS_STAGING} != false ]; then
    pnpm run gen:db:prod
  else
    pnpm run gen:db:staging
  fi
  echo "データベーススキーマの生成完了"
  echo "-------------------------------------------------"

  cd ${target_dir}"/apps/${PROJECT_NAME}"
  if [ ${IS_STAGING} = false ]; then
    pnpm run build:prod
  else
    pnpm run build:staging
  fi

  chown -h ${APP_USER}:${APP_USER} ${BRANCH_DIR} 

  echo "-------------------------------------------------"
  pwd
  ls -la
  echo "-------------------------------------------------"
  echo ${ENV_NAME}"環境をコンパイル完了しました。"

}


echo ${ENV_NAME}"環境:"${BRANCH_DIR}

if [ $is_question = 0 ]; then

  echo ${ENV_NAME}"環境をコンパイルします。よろしいですか？[Y/n]"
  read ANSER

  case $ANSER in
   "Y" | "y" | "yes" | "Yes" | "YES" ) execute;;
   *) echo 'exit!!' ;;
  esac
else
  execute
fi




