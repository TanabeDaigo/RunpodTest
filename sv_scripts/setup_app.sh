#!/bin/sh

# ====================================================
# アプリケーション環境構築スクリプト
# ====================================================
# 概要：
# 指定されたブランチのアプリケーション環境を新規構築するスクリプト
# Gitリポジトリの初期化から、指定ブランチのチェックアウトまでを実行
#
# 機能：
# 1. 指定ブランチのディレクトリ作成
# 2. 既存のGitリポジトリの初期化
# 3. リモートリポジトリの設定
# 4. 指定ブランチのチェックアウト
# 5. 対話モードでの確認（オプション）
#
# 使用方法：
# ./setup_app.sh [モード]
#   モード: 0 - 通常モード（確認あり）
#          1 - サイレントモード（確認なし）
#
# 例：
# ./setup_app.sh 0  # 確認ありで実行
# ./setup_app.sh 1  # 確認なしで実行
#
# 依存ファイル：
# - define.sh: 環境変数定義ファイル
# - .branch_dir_name: ブランチディレクトリ名
# - .branch_name: ブランチ名
#
# 環境変数：
# - APP_DIR: アプリケーションディレクトリ
# - SBIN_DIR: スクリプトディレクトリ
# - GIT_HTTP_URL: Git HTTP URL
# - GIT_URL: Git SSH URL
# - GIT_PASS: GitHubのパスフレーズ
# - SYSTEM_NAME: システム名
#
# 注意事項：
# - 実行前に適切なブランチが選択されていることを確認してください
# - 既存のディレクトリは完全に削除されます
# - GitHubのSSH鍵とパスフレーズが必要です
# - 十分なディスク容量が必要です
# - インターネット接続が必要です
# ====================================================

source ~/.bashrc
source ~/.bash_profile

source ./define.sh


SELF=${0}
if [ ${#} -le 0 ] ; then
    echo ""
    echo "App環境を構築"
    echo ""
    echo "現在のブランチ名"
    cat ${SBIN_DIR}"/.branch_name"
    echo ""
    echo "下記、引数を指定してください。"
    echo "  第１引数：0:通常 1:問い合わせなし"
    echo ""
    echo "     例："${SELF}" 0"
    echo ""
    exit 1;
fi

if [ ${1} -eq 0 ]; then
  is_question=0
else
  is_question=1
fi

echo ""
target_branch=`cat ${SBIN_DIR}/.branch_dir_name`
echo "ブランチフォルダ名:"
echo $target_branch
branch_name=`cat ${SBIN_DIR}/.branch_name`
echo "ブランチ名:"
echo $branch_name
echo ""
execute (){

  target_dir=$APP_DIR"/"${target_branch}

  if [ ! -d $target_dir ]; then
    mkdir $target_dir
  fi

  cd $target_dir

  echo "対象フォルダ："$target_dir

  echo "対象フォルダ内を削除......"
  pwd
  cmd="rm -rf ./* ./.git"
  echo $cmd
  $cmd

  sleep_time=1

  echo "gitを初期化......"
  cmd="git init"
  echo $cmd
  $cmd
  
  sleep $sleep_time

  echo "リモートURLを設定......"
  cmd="git remote remove origin"
  echo $cmd
  $cmd

  cmd="git remote add origin "${GIT_HTTP_URL}
  echo $cmd
  $cmd
  
  cmd="git remote set-url origin "${GIT_URL}
  echo $cmd
  $cmd

  cmd="git remote -v"
  echo $cmd
  $cmd

  sleep $sleep_time

  #echo "git config 設定......"
  #cmd="git config core.sparsecheckout true"
  #echo $cmd
  #$cmd
  #echo $PROJECT_NAME > .git/info/sparse-checkout

  echo "設定内容を出力......"
  #cat .git/info/sparse-checkout
  cat ./.git/config

  sleep $sleep_time
  echo "チェックアウト......"
#  git reset --hard

  expect -c "
    spawn git pull origin ${branch_name}
    expect \"Enter passphrase for key '/home/${SYSTEM_NAME}/.ssh/github':\"
    send ${GIT_PASS}\n
    interact
"

  cmd="git branch -r --contains"
  echo $cmd
  $cmd

  echo "App環境の構築が完了しました。"
  pwd
  ll -a $target_dir

}

if [ $is_question = 0 ]; then

  echo "App環境("$target_branch")を構築します。よろしいですか？[Y/n]"
  read ANSER
  case $ANSER in
   "Y" | "y" | "yes" | "Yes" | "YES" ) execute;;
   *) echo 'exit!!' ;;
  esac
else
   execute
fi
