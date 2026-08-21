#!/bin/sh

# ====================================================
# パッケージインストールスクリプト
# ====================================================
# 概要：
# 指定されたブランチのWebアプリケーションディレクトリで
# pnpm installを実行し、依存パッケージをインストールするスクリプト
#
# 機能：
# 1. 指定ブランチのディレクトリに移動
# 2. pnpm installコマンドの実行
# 3. 対話モードでの確認（オプション）
#
# 使用方法：
# ./npm_install.sh [モード]
#   モード: 0 - 通常モード（確認あり）
#          1 - サイレントモード（確認なし）
#
# 例：
# ./npm_install.sh 0  # 確認ありで実行
# ./npm_install.sh 1  # 確認なしで実行
#
# 依存ファイル：
# - define.sh: 環境変数定義ファイル
# - .branch_dir_name: ブランチディレクトリ名
# - .branch_name: ブランチ名
#
# 環境変数：
# - APP_DIR: アプリケーションディレクトリ
# - SBIN_DIR: スクリプトディレクトリ
#
# 注意事項：
# - 実行前に適切なブランチが選択されていることを確認してください
# - インターネット接続が必要です
# - インストールには時間がかかる場合があります
# - ディスク容量が十分にあることを確認してください
# - package.jsonとpnpm-lock.yamlが存在することを確認してください
# ====================================================

source ~/.bashrc
source ~/.bash_profile

source define.sh

SELF=${0}
if [ ${#} -le 0 ] ; then
    echo ""
    echo "npm install"
    echo ""
    echo "下記、引数を指定してください。"
    echo "  第１引数：0:通常 1:問い合わせなし"
    echo ""
    echo "     例："${SELF}" 0 "
    echo ""
    exit 1;
fi

is_question=${0}

target_branch=`cat ${SBIN_DIR}/.branch_dir_name`
branch_name=`cat ${SBIN_DIR}/.branch_name`
target_dir=$APP_DIR"/"${target_branch}

BRANCH_DIR=${target_dir}

execute (){
  cd $BRANCH_DIR

  pwd
  pnpm ci


  # PuppeteerのChromiumをインストール（apps配下の全アプリ）
  echo "PuppeteerのChromiumをインストール中..."

  npx puppeteer browsers install chrome || echo "Chromiumインストールに失敗しました（既にインストール済みの可能性があります）"

  for app_path in $BRANCH_DIR/apps/*/; do
    if [ -f "${app_path}package.json" ]; then
      app_name=$(basename "$app_path")
      cd "$app_path"
      pnpm exec puppeteer browsers install chrome || echo "${app_name}アプリのChromiumインストールに失敗しました（既にインストール済みの可能性があります）"
    fi
  done

  echo "pnpm install 完了しました。"${BRANCH_DIR}
}

if [ $is_question = 0 ]; then 
  echo "pnpm installします。よろしいですか？[Y/n]"

  read ANSER
  case $ANSER in
   "Y" | "y" | "yes" | "Yes" | "YES" ) execute ${1};;
   *) echo 'exit!!' ;;
  esac
else
  execute ${1}
fi

