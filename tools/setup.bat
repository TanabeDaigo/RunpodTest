@echo off
chcp 65001 > nul

REM 管理者権限チェック
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo このスクリプトは管理者権限で実行する必要があります。
    echo PowerShellを管理者として実行し、再度実行してください。
    pause
    exit /b 1
)

echo 開発環境のセットアップを開始します...

REM 現在のディレクトリを取得
set CURRENT_DIR=%CD%

REM Node.jsのバージョン確認
echo Node.jsのバージョンを確認...
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Node.jsがインストールされていません。
    echo nvm-windowsをインストールします...
    powershell -Command "Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))"
    call choco install nvm -y
    call nvm install 22.11.0
    call nvm use 22.11.0
) else (
    echo 現在のNode.jsバージョンを確認...
    for /f "tokens=*" %%a in ('node -v') do set CURRENT_NODE_VERSION=%%a
    if not "%CURRENT_NODE_VERSION%"=="v22.11.0" (
        echo Node.jsのバージョンが22.11.0ではありません。
        echo nvm-windowsをインストールします...
        powershell -Command "Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))"
        call choco install nvm -y
        call nvm install 22.11.0
        call nvm use 22.11.0
    )
)

REM PATHを更新
set PATH=%PATH%;%APPDATA%\nvm;%APPDATA%\nvm\nodejs

REM pnpmのインストール
echo pnpmのインストール...
call npm install -g pnpm
if %ERRORLEVEL% NEQ 0 (
    echo pnpmのインストールに失敗しました。
    pause
    exit /b 1
)

REM 依存関係のインストール
echo 依存関係のインストール...
call pnpm install

REM 各パッケージのセットアップ
echo パッケージのセットアップ...

REM commonパッケージ
echo commonパッケージのセットアップ...
cd packages\common
call pnpm install
cd %CURRENT_DIR%

REM metrojsパッケージ
echo metrojsパッケージのセットアップ...
cd packages\metrojs
call pnpm install
cd %CURRENT_DIR%

REM webappのセットアップ
echo webappのセットアップ...
cd apps\webapp
call pnpm install
cd %CURRENT_DIR%

REM 環境変数の設定
echo 環境変数の設定...
setx NODE_ENV "development"
setx NEXT_PUBLIC_API_URL "http://localhost:3000/api"

echo セットアップが完了しました。
echo 以下のコマンドで開発サーバーを起動できます：
echo pnpm dev
pause 