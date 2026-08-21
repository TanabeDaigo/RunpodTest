@echo off
setlocal enabledelayedexpansion
chcp 65001 > nul
echo MetroJSパッケージの更新を開始します...

echo.
echo 0. pnpmのキャッシュをクリアします...
call pnpm store prune
if %ERRORLEVEL% NEQ 0 (
    echo pnpm store prune に失敗しましたが、続行します。
)

echo.
echo 1. apps\ フォルダ配下のプロジェクトで @krono-metro/metrojs@latest をインストールします...

set "apps_dir=%~dp0..\apps"
if not exist "%apps_dir%" (
    echo apps\ ディレクトリが見つかりません。
    exit /b 1
)

cd /d "%apps_dir%"
if %ERRORLEVEL% NEQ 0 (
    echo apps\ ディレクトリに移動できません。
    exit /b 1
)

set "app_count=0"
for /d %%i in (*) do (
    if exist "%%i\package.json" (
        set /a app_count+=1
        echo.
        echo   [%app_count%] apps\%%i\ で @krono-metro/metrojs@latest をインストールします...
        cd /d "%%i"
        if !ERRORLEVEL! NEQ 0 (
            echo     apps\%%i\ ディレクトリに移動できません。
            continue
        )

        
        call pnpm install @krono-metro/metrojs@latest --force
        if !ERRORLEVEL! NEQ 0 (
            echo     apps\%%i\ での @krono-metro/metrojs@latest のインストールに失敗しました。
            cd /d "%apps_dir%"
            continue
        )
        echo     apps\%%i\ でのインストールが完了しました。
        cd /d "%apps_dir%"
    )
)

if %app_count% EQU 0 (
    echo apps\ フォルダ配下にpackage.jsonがあるプロジェクトが見つかりませんでした。
    exit /b 1
)

echo.
echo 2. packages\common\ で @krono-metro/metrojs@latest をインストールします...
cd /d "%~dp0..\packages\common"
if %ERRORLEVEL% NEQ 0 (
    echo packages\common\ ディレクトリが見つかりません。
    exit /b 1
)

call pnpm install @krono-metro/metrojs@latest
if %ERRORLEVEL% NEQ 0 (
    echo packages\common\ での @krono-metro/metrojs@latest のインストールに失敗しました。
    exit /b %ERRORLEVEL%
)
echo packages\common\ でのインストールが完了しました。

echo.
echo 3. ルートフォルダで pnpm install を実行します...
cd /d "%~dp0.."
if %ERRORLEVEL% NEQ 0 (
    echo ルートディレクトリが見つかりません。
    exit /b 1
)

call pnpm install
if %ERRORLEVEL% NEQ 0 (
    echo ルートフォルダでの pnpm install の実行に失敗しました。
    exit /b %ERRORLEVEL%
)

echo.
echo MetroJSパッケージの更新が完了しました。
echo.
echo 実行内容:
echo - apps\ フォルダ配下の%app_count%個のプロジェクトで @krono-metro/metrojs@latest をインストール
echo - packages\common\ で @krono-metro/metrojs@latest をインストール  
echo - ルートフォルダで pnpm install を実行
echo.
pause
