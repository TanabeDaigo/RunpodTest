# プライベートパッケージのパブリッシュを自動化するスクリプト
# 使用方法: .\tools\publish-metrojs.ps1

# 文字化けを防ぐためにUTF-8エンコーディングを設定（最優先で実行）
# コンソールのコードページをUTF-8に変更（最初に実行）
$null = [Console]::OutputEncoding
try {
    $OutputEncoding = [System.Text.Encoding]::UTF8
    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
    [Console]::InputEncoding = [System.Text.Encoding]::UTF8
    [System.Console]::OutputEncoding = [System.Text.Encoding]::UTF8
    chcp 65001 | Out-Null
} catch {
    # エラーが発生しても続行
}

# PowerShellのデフォルトエンコーディング設定
$PSDefaultParameterValues['*:Encoding'] = 'utf8'
$PSDefaultParameterValues['Out-File:Encoding'] = 'utf8'
$PSDefaultParameterValues['Set-Content:Encoding'] = 'utf8'

# PowerShellの出力ストリームのエンコーディングを設定
try {
    if ($host.UI.RawUI.PSObject.Properties.Name -contains 'OutputEncoding') {
        $host.UI.RawUI.OutputEncoding = [System.Text.Encoding]::UTF8
    }
} catch {
    # 設定できない場合は無視
}

$ErrorActionPreference = "Stop"

# スクリプトのルートディレクトリを取得（toolsフォルダの親ディレクトリ）
$ScriptRoot = Split-Path -Parent $PSScriptRoot
$PackageDir = Join-Path $ScriptRoot "packages\metrojs"

# 元の場所を保存（エラー時でも確実に戻るため）
$originalLocation = Get-Location

try {
    Write-Host "=========================================" -ForegroundColor Cyan
    Write-Host "パッケージパブリッシュ" -ForegroundColor Cyan
    Write-Host "=========================================" -ForegroundColor Cyan
    Write-Host ""

    # 1. npm pack --dry-runを実行
    Write-Host "[1/2] npm pack --dry-run を実行中..." -ForegroundColor Yellow

    Set-Location $PackageDir

    # 標準出力とエラー出力を分けてキャプチャ
    $stdout = [System.Collections.ArrayList]::new()
    $stderr = [System.Collections.ArrayList]::new()
    
    $process = Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "npm", "pack", "--dry-run" -NoNewWindow -Wait -PassThru -RedirectStandardOutput "temp_stdout.txt" -RedirectStandardError "temp_stderr.txt"
    $dryRunExitCode = $process.ExitCode
    
    # 出力ファイルを読み込む
    if (Test-Path "temp_stdout.txt") {
        $stdoutContent = Get-Content "temp_stdout.txt" -Raw -ErrorAction SilentlyContinue
        if ($stdoutContent) {
            $stdout.AddRange($stdoutContent -split "`n")
        }
        Remove-Item "temp_stdout.txt" -ErrorAction SilentlyContinue
    }
    
    if (Test-Path "temp_stderr.txt") {
        $stderrContent = Get-Content "temp_stderr.txt" -Raw -ErrorAction SilentlyContinue
        if ($stderrContent) {
            $stderr.AddRange($stderrContent -split "`n")
        }
        Remove-Item "temp_stderr.txt" -ErrorAction SilentlyContinue
    }

    if ($dryRunExitCode -ne 0) {
        Write-Host "エラー: npm pack --dry-run が失敗しました" -ForegroundColor Red
        Write-Host ""
        Write-Host "終了コード: $dryRunExitCode" -ForegroundColor Red
        Write-Host ""
        if ($stdout.Count -gt 0) {
            Write-Host "標準出力:" -ForegroundColor Yellow
            foreach ($line in $stdout) {
                Write-Host $line -ForegroundColor Gray
            }
            Write-Host ""
        }
        if ($stderr.Count -gt 0) {
            Write-Host "エラー出力:" -ForegroundColor Red
            foreach ($line in $stderr) {
                Write-Host $line -ForegroundColor Red
            }
            Write-Host ""
        }
        # フォールバック: 通常の方法でも試す
        Write-Host "詳細情報を取得中..." -ForegroundColor Yellow
        $fallbackResult = npm pack --dry-run 2>&1
        Write-Host $fallbackResult
        exit 1
    }
    
    # 成功時は標準出力を表示
    if ($stdout.Count -gt 0) {
        foreach ($line in $stdout) {
            Write-Host $line
        }
    }

    Write-Host "✓ npm pack --dry-run が成功しました" -ForegroundColor Green
    Write-Host ""

    Set-Location $originalLocation

    # 2. npm publishを実行
    Write-Host "[2/2] npm publish を実行中..." -ForegroundColor Yellow

    Set-Location $PackageDir

    Write-Host "パブリッシュを開始します..." -ForegroundColor Gray
    
    # 標準出力とエラー出力を分けてキャプチャ
    $publishStdout = [System.Collections.ArrayList]::new()
    $publishStderr = [System.Collections.ArrayList]::new()
    
    $publishProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "npm", "publish" -NoNewWindow -Wait -PassThru -RedirectStandardOutput "temp_publish_stdout.txt" -RedirectStandardError "temp_publish_stderr.txt"
    $publishExitCode = $publishProcess.ExitCode
    
    # 出力ファイルを読み込む
    if (Test-Path "temp_publish_stdout.txt") {
        $publishStdoutContent = Get-Content "temp_publish_stdout.txt" -Raw -ErrorAction SilentlyContinue
        if ($publishStdoutContent) {
            $publishStdout.AddRange($publishStdoutContent -split "`n")
        }
        Remove-Item "temp_publish_stdout.txt" -ErrorAction SilentlyContinue
    }
    
    if (Test-Path "temp_publish_stderr.txt") {
        $publishStderrContent = Get-Content "temp_publish_stderr.txt" -Raw -ErrorAction SilentlyContinue
        if ($publishStderrContent) {
            $publishStderr.AddRange($publishStderrContent -split "`n")
        }
        Remove-Item "temp_publish_stderr.txt" -ErrorAction SilentlyContinue
    }
    
    # 標準出力を表示
    if ($publishStdout.Count -gt 0) {
        foreach ($line in $publishStdout) {
            Write-Host $line
        }
    }

    if ($publishExitCode -ne 0) {
        Write-Host ""
        Write-Host "エラー: npm publish が失敗しました" -ForegroundColor Red
        Write-Host ""
        Write-Host "終了コード: $publishExitCode" -ForegroundColor Red
        Write-Host ""
        if ($publishStderr.Count -gt 0) {
            Write-Host "エラー出力:" -ForegroundColor Red
            foreach ($line in $publishStderr) {
                Write-Host $line -ForegroundColor Red
            }
            Write-Host ""
        }
        # フォールバック: 通常の方法でも試す
        Write-Host "詳細情報を取得中..." -ForegroundColor Yellow
        $fallbackPublishResult = npm publish 2>&1
        Write-Host $fallbackPublishResult
        exit 1
    }

    Write-Host ""
    Write-Host "✓ パブリッシュが成功しました！" -ForegroundColor Green

    Set-Location $originalLocation

    Write-Host ""
    Write-Host "=========================================" -ForegroundColor Cyan
    Write-Host "完了！" -ForegroundColor Cyan
    Write-Host "=========================================" -ForegroundColor Cyan
}
catch {
    Write-Host ""
    Write-Host "=========================================" -ForegroundColor Red
    Write-Host "エラーが発生しました" -ForegroundColor Red
    Write-Host "=========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "エラーメッセージ: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "エラーの詳細:" -ForegroundColor Yellow
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "エラーの種類: $($_.Exception.GetType().FullName)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "スタックトレース:" -ForegroundColor Yellow
    Write-Host $_.ScriptStackTrace -ForegroundColor Gray
    Write-Host ""
    if ($_.Exception.InnerException) {
        Write-Host "内部例外:" -ForegroundColor Yellow
        Write-Host $_.Exception.InnerException.Message -ForegroundColor Red
        Write-Host ""
    }
    exit 1
}
finally {
    # エラーが発生した場合でも、確実に元の場所に戻る
    if ((Get-Location).Path -ne $originalLocation.Path) {
        Set-Location $originalLocation
    }
}
