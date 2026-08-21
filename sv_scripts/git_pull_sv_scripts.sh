#!/bin/sh

# ====================================================
# sv_scripts配下リポジトリ pull スクリプト
# ====================================================
# 概要：
# gitリポジトリのルートで git pull を実行するスクリプト
#
# 機能：
# 1. gitリポジトリのルートを特定
# 2. 現在のブランチを表示
# 3. git pull を実行（パスフレーズは自動入力）
#
# 使用方法：
# ./git_pull_sv_scripts.sh [モード]
#   モード: 0 - 通常モード（確認あり）
#          1 - サイレントモード（確認なし）
#
# 例：
# ./git_pull_sv_scripts.sh 0  # 確認ありで実行
# ./git_pull_sv_scripts.sh 1  # 確認なしで実行
#
# 依存ファイル：
# - define.sh: 環境変数定義ファイル
#
# 環境変数：
# - GIT_PASS: GitHubのパスフレーズ
# - SBIN_DIR: スクリプトディレクトリ
#
# 注意事項：
# - GitHubのSSH鍵とパスフレーズが必要です
# - 実行前に適切なブランチにいることを確認してください
# ====================================================

source ~/.bashrc
source ~/.bash_profile

source ./define.sh

SELF=${0}
is_question=${1:-0}

# 引数チェック
if [ ${#} -gt 1 ]; then
    echo ""
    echo "引数が多すぎます。"
    echo ""
    echo "使用方法："
    echo "  ${SELF} [モード]"
    echo "    モード: 0 - 通常モード（確認あり）"
    echo "           1 - サイレントモード（確認なし）"
    echo ""
    echo "     例：${SELF} 0"
    echo ""
    exit 1;
fi

# gitリポジトリのルートディレクトリを取得
# sv_scriptsフォルダの一階層上をgitリポジトリのルートとする
GIT_ROOT=$(cd ${SBIN_DIR}/.. && pwd)

if [ ! -d "${GIT_ROOT}/.git" ]; then
    echo "エラー: gitリポジトリのルートディレクトリが見つかりません。"
    echo "       ${GIT_ROOT}/.git が存在しません。"
    exit 1
fi

# gitリポジトリのルートに移動
cd ${GIT_ROOT}
echo "gitリポジトリのルート: ${GIT_ROOT}"
echo ""

# 現在のブランチ名を取得
CURRENT_BRANCH=$(git branch --show-current)
echo "現在のブランチ: ${CURRENT_BRANCH}"
echo ""

# 通常モードの場合、確認を求める
if [ ${is_question} = 0 ]; then
    echo "リモートから pull しますか？[Y/n]"
    read ANSER
    case $ANSER in
     "Y" | "y" | "yes" | "Yes" | "YES" ) ;;
     *) echo 'exit!!' ; exit 1 ;;
    esac
fi

# git pullを実行（パスフレーズは自動入力）
echo "リモートリポジトリから pull しています..."
expect -c "
  spawn git pull origin ${CURRENT_BRANCH}
  expect {
    \"Enter passphrase for key\" {
      send ${GIT_PASS}\r
      exp_continue
    }
    \"Username for\" {
      send \r
      exp_continue
    }
    \"Password for\" {
      send \r
      exp_continue
    }
    eof
  }
"

if [ $? -eq 0 ]; then
    echo "pull が完了しました。"
else
    echo "pull に失敗しました。"
    exit 1
fi

echo ""
echo "処理が完了しました。"
