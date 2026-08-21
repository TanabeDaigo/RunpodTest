#!/bin/sh

# ====================================================
# sv_scripts配下ファイル自動コミットスクリプト
# ====================================================
# 概要：
# sv_scriptsフォルダ配下のファイルが更新されていたら
# gitにコミットするスクリプト
#
# 機能：
# 1. sv_scriptsフォルダ配下の変更をチェック
# 2. 変更があればgit addを実行
# 3. git commitを実行（コミットメッセージは自動生成）
# 4. git pull --rebase でリモートの変更を取り込み（non-fast-forward エラー防止）
# 5. git pushを実行（パスフレーズは自動入力）
#
# 使用方法：
# ./git_commit_sv_scripts.sh [モード]
#   モード: 0 - 通常モード（確認あり）
#          1 - サイレントモード（確認なし）
#
# 例：
# ./git_commit_sv_scripts.sh 0  # 確認ありで実行
# ./git_commit_sv_scripts.sh 1  # 確認なしで実行
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

# sv_scripts配下の変更をチェック
echo "変更をチェックしています..."
git status --porcelain sv_scripts/ | grep -q .

if [ $? -ne 0 ]; then
    echo "sv_scripts配下に変更はありません。"
    exit 0
fi

# 変更がある場合、変更内容を表示
echo "以下のファイルに変更があります："
echo "--------------------------------------"
git status --short sv_scripts/
echo "--------------------------------------"
echo ""

# 通常モードの場合、確認を求める
if [ ${is_question} = 0 ]; then
    echo "これらの変更をコミットしますか？[Y/n]"
    read ANSER
    case $ANSER in
     "Y" | "y" | "yes" | "Yes" | "YES" ) ;;
     *) echo 'exit!!' ; exit 1 ;;
    esac
fi

# コミットメッセージを生成（日時を含める）
COMMIT_MESSAGE="Update sv_scripts files - $(date +'%Y-%m-%d %H:%M:%S')"

# git addを実行
echo "変更をステージングしています..."
git add sv_scripts/

# git commitを実行
echo "コミットを実行しています..."
git commit -m "${COMMIT_MESSAGE}"

if [ $? -ne 0 ]; then
    echo "コミットに失敗しました。"
    exit 1
fi

echo "コミットが完了しました。"
echo "コミットメッセージ: ${COMMIT_MESSAGE}"
echo ""

# リモートの変更を取り込んでから push（non-fast-forward エラー防止）
echo "リモートの変更を取り込んでいます..."
expect -c "
  spawn git pull --rebase origin ${CURRENT_BRANCH}
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

if [ $? -ne 0 ]; then
    echo "pull に失敗しました。競合がある場合は手動で解消してください。"
    exit 1
fi

echo "リモートの変更を取り込みました。"
echo ""

# git pushを実行（パスフレーズは自動入力）
echo "リモートリポジトリにプッシュしています..."
expect -c "
  spawn git push origin ${CURRENT_BRANCH}
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
    echo "プッシュが完了しました。"
else
    echo "プッシュに失敗しました。"
    exit 1
fi

echo ""
echo "処理が完了しました。"
