#!/bin/bash

echo "開発環境のセットアップを開始します..."

# 現在のディレクトリを取得
CURRENT_DIR=$(pwd)

# Node.jsのバージョン確認
echo "Node.jsのバージョンを確認..."
if ! command -v node &> /dev/null; then
    echo "Node.jsがインストールされていません。"
    echo "nvmをインストールします..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm install 22.11.0
    nvm use 22.11.0
else
    echo "現在のNode.jsバージョンを確認..."
    CURRENT_NODE_VERSION=$(node -v)
    if [ "$CURRENT_NODE_VERSION" != "v22.11.0" ]; then
        echo "Node.jsのバージョンが22.11.0ではありません。"
        echo "nvmをインストールします..."
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        nvm install 22.11.0
        nvm use 22.11.0
    fi
fi

# pnpmのインストール
echo "pnpmのインストール..."
if ! command -v pnpm &> /dev/null; then
    npm install -g pnpm
    if [ $? -ne 0 ]; then
        echo "pnpmのインストールに失敗しました。"
        exit 1
    fi
fi

# 依存関係のインストール
echo "依存関係のインストール..."
pnpm install

# 各パッケージのセットアップ
echo "パッケージのセットアップ..."

# commonパッケージ
echo "commonパッケージのセットアップ..."
cd packages/common
pnpm install
cd "$CURRENT_DIR"

# metrojsパッケージ
echo "metrojsパッケージのセットアップ..."
cd packages/metrojs
pnpm install
cd "$CURRENT_DIR"

# webappのセットアップ
echo "webappのセットアップ..."
cd apps/webapp
pnpm install
cd "$CURRENT_DIR"

# 環境変数の設定
echo "環境変数の設定..."
echo 'export NODE_ENV="development"' >> ~/.bashrc
echo 'export NEXT_PUBLIC_API_URL="http://localhost:3000/api"' >> ~/.bashrc
source ~/.bashrc

echo "セットアップが完了しました。"
echo "以下のコマンドで開発サーバーを起動できます："
echo "pnpm dev"
