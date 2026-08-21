#!/bin/sh

# ====================================================
# Gitリポジトリエクスポートスクリプト
# ====================================================
# 概要：
# 指定されたブランチのGitリポジトリをエクスポートし、
# 必要に応じて依存関係のインストールを行うスクリプト
#
# 機能：
# 1. 指定されたブランチのGitリポジトリをエクスポート
# 2. 差分または全ファイルのエクスポートオプション
# 3. pnpm installの実行オプション
# 4. 対話モードでの確認（オプション）
#
# 使用方法：
# ./export.sh [エクスポートモード] [インストールモード] [確認モード]
#   エクスポートモード: 0 - 差分エクスポート
#                     1 - 全ファイルエクスポート
#   インストールモード: 0 - pnpm installを実行
#                     1 - pnpm installをスキップ
#   確認モード: 0 - 確認あり
#             1 - 確認なし
#
# 例：
# ./export.sh 0 0 0  # 差分エクスポート、インストール実行、確認あり
# ./export.sh 1 1 1  # 全ファイルエクスポート、インストールスキップ、確認なし
#
# 依存ファイル：
# - define.sh: 環境変数定義ファイル
# - .branch_dir_name: ブランチディレクトリ名
# - .branch_name: ブランチ名
#
# 環境変数：
# - SYSTEM_NAME: システム名
# - GIT_PASS: GitHubのパスフレーズ
# - APP_DIR: アプリケーションディレクトリ
# - WEB_APP_DIR: Webアプリケーションディレクトリ
#
# 注意事項：
# - 全ファイルエクスポート時はgit reset --hardが実行されます
# - GitHubのSSH鍵とパスフレーズが必要です
# - 実行前に適切なブランチが選択されていることを確認してください
# ====================================================

source ~/.bashrc
source ~/.bash_profile

source define.sh

SELF=${0}
if [ ${#} -le 0 ] ; then
    echo ""
    echo "Export処理"
    echo ""
    echo "下記、引数を指定してください。"
    echo "  第１引数：0 差分、1 全て"
    echo "  第２引数：0 通常、1 pnpm installを実行しない"
    echo "  第３引数：0 通常、1 問い合わせなし"
    echo ""
    echo "     例："${SELF}" 0 1 0"
    echo ""
    exit 1;
fi

target_branch=`cat ${SBIN_DIR}/.branch_dir_name`
branch_name=`cat ${SBIN_DIR}/.branch_name`
target_dir=$APP_DIR"/"${target_branch}
BRANCH_DIR=${target_dir}

is_all=${1}

if [ $# -ge 2 ]; then 
  is_install=${2}
else 
  is_install=0
fi

if [ $# -ge 3 ]; then 
  is_question=${3}
else 
  is_question=0
fi

echo "target_branch:"$target_branch" - is_all:"$is_all " - is_install:"$is_install

echo "WEB_APP_DIR:"${WEB_APP_DIR}

npm_install (){
  "${SBIN_DIR}/npm_install.sh" 1

}

execute (){
  cd ${target_dir}

  if [ $is_all -eq 1 ]; then
    echo "git reset --hard"
    cmd=`git reset --hard`
    echo $cmd
  fi


  expect -c "
    spawn git pull origin ${branch_name}
    expect \"Enter passphrase for key '/home/${SYSTEM_NAME}/.ssh/github':\"
    send ${GIT_PASS}\n
    interact
  "
  if [ $is_install -eq 0 ]; then

    echo "\n" 
    echo "pnpm install 実行しますか？[Y/n]"
    read ANSER

    case $ANSER in
     "Y" | "y" | "yes" | "Yes" | "YES" ) npm_install;;
     *) echo 'exit!!' ;;
    esac

  fi 
  echo "エクスポート完了しました。"
}




if [ $is_question = 0 ]; then
  if [ $is_all -eq 1 ]; then 
    echo "全てエクスポートします。よろしいですか？[Y/n]"
  else
    echo "差分をエクスポートします。よろしいですか？[Y/n]"
  fi

  read ANSER
  case $ANSER in
   "Y" | "y" | "yes" | "Yes" | "YES" ) execute;;
   *) echo 'exit!!' ;;
  esac
else
  execute
fi
