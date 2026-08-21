@echo off
setlocal enabledelayedexpansion
chcp 65001 > nul
echo クリーンインストールを開始します...

echo 1. 削除対象のフォルダを表示します...
echo.
echo 削除対象フォルダ:
if exist .turbo echo - .\turbo
if exist .next echo - .\next
if exist dist echo - .\dist
if exist node_modules echo - .\node_modules
if exist pnpm-lock.yaml echo - .\pnpm-lock.yaml
if exist package-lock.json echo - .\package-lock.json

echo.
echo サブディレクトリ内の削除対象:
set "has_targets=0"
for /d %%d in (*) do (
    if not "%%d"=="node_modules" (
        if exist "%%d\.turbo" (
            echo - %%d\.turbo
            set "has_targets=1"
        )
        if exist "%%d\.next" (
            echo - %%d\.next
            set "has_targets=1"
        )
        if exist "%%d\dist" (
            echo - %%d\dist
            set "has_targets=1"
        )
        if exist "%%d\node_modules" (
            echo - %%d\node_modules
            set "has_targets=1"
        )
        if exist "%%d\pnpm-lock.yaml" (
            echo - %%d\pnpm-lock.yaml
            set "has_targets=1"
        )
        if exist "%%d\package-lock.json" (
            echo - %%d\package-lock.json
            set "has_targets=1"
        )
        for /d %%e in ("%%d\*") do (
            if not "%%e"=="node_modules" (
                if exist "%%e\.turbo" (
                    echo - %%e\.turbo
                    set "has_targets=1"
                )
                if exist "%%e\.next" (
                    echo - %%e\.next
                    set "has_targets=1"
                )
                if exist "%%e\dist" (
                    echo - %%e\dist
                    set "has_targets=1"
                )
                if exist "%%e\node_modules" (
                    echo - %%e\node_modules
                    set "has_targets=1"
                )
                if exist "%%e\pnpm-lock.yaml" (
                    echo - %%e\pnpm-lock.yaml
                    set "has_targets=1"
                )
                if exist "%%e\package-lock.json" (
                    echo - %%e\package-lock.json
                    set "has_targets=1"
                )
            )
        )
    )
)

echo.
if "%has_targets%"=="1" (
    set "confirm="
    set /p confirm="上記のフォルダとファイルを削除します。よろしいですか？ (y/n): "
    if defined confirm (
        if /i "!confirm!"=="y" (
            echo 削除を開始します...
            goto :continue
        ) else (
            echo 処理を中止しました。
            exit /b 0
        )
    ) else (
        echo 処理を中止しました。
        exit /b 0
    )
) else (
    echo 削除対象のフォルダとファイルが見つかりませんでした。
    goto :continue
)

:continue
echo.
echo 1. .turbo, .next, dist フォルダを削除します...
if exist .turbo rmdir /s /q .turbo
if exist .next rmdir /s /q .next
if exist dist rmdir /s /q dist

echo 1-1. サブディレクトリ内の.turbo, .next, dist フォルダを削除します...
for /d %%d in (*) do (
    if not "%%d"=="node_modules" (
        if exist "%%d\.turbo" rd /s /q "%%d\.turbo"
        if exist "%%d\.next" rd /s /q "%%d\.next"
        if exist "%%d\dist" rd /s /q "%%d\dist"
        for /d %%e in ("%%d\*") do (
            if not "%%e"=="node_modules" (
                if exist "%%e\.turbo" rd /s /q "%%e\.turbo"
                if exist "%%e\.next" rd /s /q "%%e\.next"
                if exist "%%e\dist" rd /s /q "%%e\dist"
            )
        )
    )
)

echo 2. node_modules と pnpm-lock.yaml と package-lock.json を削除します...
if exist node_modules rmdir /s /q node_modules
if exist pnpm-lock.yaml del /f /q pnpm-lock.yaml
if exist package-lock.json del /f /q package-lock.json

echo 2-1. サブディレクトリ内のnode_modulesとpnpm-lock.yamlを削除します...
for /d %%d in (*) do (
    if not "%%d"=="node_modules" (
        if exist "%%d\node_modules" rd /s /q "%%d\node_modules"
        if exist "%%d\pnpm-lock.yaml" del /f /q "%%d\pnpm-lock.yaml"
        if exist "%%d\package-lock.json" del /f /q "%%d\package-lock.json"
        for /d %%e in ("%%d\*") do (
            if not "%%e"=="node_modules" (
                if exist "%%e\node_modules" rd /s /q "%%e\node_modules"
                if exist "%%e\pnpm-lock.yaml" del /f /q "%%e\pnpm-lock.yaml"
                if exist "%%e\package-lock.json" del /f /q "%%e\package-lock.json"
            )
        )
    )
)

echo 3. pnpm store prune を実行します...
call pnpm store prune
if %ERRORLEVEL% NEQ 0 (
    echo pnpm store prune の実行に失敗しました。
    exit /b %ERRORLEVEL%
)

echo 4. pnpm install を実行します...
call pnpm install
if %ERRORLEVEL% NEQ 0 (
    echo pnpm install の実行に失敗しました。
    exit /b %ERRORLEVEL%
)

echo 5. 各アプリで Puppeteer Chrome をインストールします...
for /d %%a in (apps\*) do (
    if exist "%%a\package.json" (
        echo --- %%a ---
        pushd "%%a"
        call npx puppeteer browsers install chrome
        if !ERRORLEVEL! NEQ 0 (
            echo %%a での Puppeteer Chrome インストールに失敗しました。
            popd
            exit /b !ERRORLEVEL!
        )
        popd
    )
)
echo Puppeteer Chrome のインストールが完了しました。

echo.
echo クリーンインストールが完了しました。 