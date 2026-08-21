#!/bin/sh

# ====================================================
# ブランチ切り替えスクリプト
# ====================================================
# 概要：
# Gitブランチの切り替えと環境構築を行うスクリプト
# 指定されたブランチの環境を構築し、Webアプリケーションの
# シンボリックリンクを更新します
#
# 機能：
# 1. リモートリポジトリの最新情報取得（git fetch）
# 2. ブランチ情報の保存
#    - .branch_name: ブランチ名
#    - .branch_dir_name: ディレクトリ名（スラッシュを__に変換）
# 3. 環境構築
#    - 新規ブランチ: setup_app.shを実行
#    - 既存ブランチ: export.shを実行
# 4. Webアプリケーションのシンボリックリンク更新
# 5. 対話モードでの確認（オプション）
#
# 使用方法：
# ./switch_branch.sh [モード]
#   モード: 0 - 通常モード（確認あり）
#          1 - サイレントモード（確認なし）
#
# 例：
# ./switch_branch.sh 0  # 確認ありで実行
# ./switch_branch.sh 1  # 確認なしで実行
#
# 依存ファイル：
# - define.sh: 環境変数定義ファイル
# - setup_app.sh: 新規環境構築スクリプト
# - export.sh: 既存環境更新スクリプト
# - link_webapp.sh: シンボリックリンク更新スクリプト
#
# 環境変数：
# - SYSTEM_NAME: システム名
# - GIT_PASS: GitHubのパスフレーズ
# - APP_DIR: アプリケーションディレクトリ
# - SBIN_DIR: スクリプトディレクトリ
#
# 注意事項：
# - GitHubのSSH鍵とパスフレーズが必要です
# - 実行前に適切なブランチ名を指定してください
# - 新規ブランチの場合は環境構築に時間がかかります
# - 既存ブランチの場合は差分更新が行われます
# - ブランチ名に含まれるスラッシュ（/）は__に変換されます
# ====================================================

source ~/.bashrc
source ~/.bash_profile

source ./define.sh


SELF=${0}
if [ ${#} -le 0 ] ; then
    echo ""
    echo "branch を 切り替える "
    echo ""
    echo "下記、引数を指定してください。"
    echo "  第１引数：0:通常 1:問い合わせなし"
    echo ""

    echo "現在のブランチ名"
    cat ${SBIN_DIR}"/.branch_name"
    echo ""
    echo "ブランチ一覧------------------------------------------"
    git branch -a 
    echo ""
    echo "     例："${SELF}" 0"
    echo ""
    exit 1;
fi

expect -c "
  spawn git fetch --all
  expect \"Enter passphrase for key '/home/${SYSTEM_NAME}/.ssh/github':\"
  send ${GIT_PASS}\n
  interact
"



is_question=${1}

switch_branch (){

  #echo $BRANCH_NAME
  echo $BRANCH_NAME > .branch_name
  echo ${BRANCH_NAME//\//__} > .branch_dir_name

  echo "切り替え後のブランチ情報--------------"
  cat .branch_name
  cat .branch_dir_name
  echo "--------------------------------------"

}


execute (){

  switch_branch

  echo ${APP_DIR}"作成します。"
  mkdir ${DIR_NAME}

  echo "対象ブランチ設定を切り替えました。"

  # 対象ブランチの構築
  ${SBIN_DIR}"/setup_app.sh" 1

  # webappリンクの切り替え
  ${SBIN_DIR}"/link_webapp.sh" 1 

  echo "${BRANCH_NAME}ブランチに切り替えが完了しました。"
}

execute2 (){

  switch_branch

  echo "対象ブランチ設定を切り替えました。"

  # 対象ブランチの構築
  ${SBIN_DIR}"/export.sh" 1 0 0

  # webappリンクの切り替え
  ${SBIN_DIR}"/link_webapp.sh" 1 

  echo "${BRANCH_NAME}ブランチ切り替え" "${BRANCH_NAME}ブランチに切り替えが完了しました。"
}

echo "ブランチを指定してください。[ブランチ名]"
echo " 例：  remotes/origin/feature/417 "

git branch -a

read BRANCH_NAME

BRANCH_NAME=${BRANCH_NAME/remotes\/origin\//}

if [ $is_question = 0 ]; then

  DIR_NAME=${APP_DIR}/${BRANCH_NAME//\//__}

  if [ ! -d ${DIR_NAME} ]; then
    echo $BRANCH_NAME"環境を構築します。よろしいですか？[Y/n]"
    read ANSER
    case $ANSER in
     "Y" | "y" | "yes" | "Yes" | "YES" ) execute;;
    *) echo 'exit!!' ;;
    esac
  else
    echo "対象のフォルダは存在しています。"${DIR_NAME}
    echo "対象ブランチを切り替えます。"
    execute2
  fi

fi




