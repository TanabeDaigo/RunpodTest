#!/bin/bash

# ====================================================
# システム初期設定スクリプト
# ====================================================
# 概要：
# システムの初期設定を行うスクリプト
# スクリプトファイルのパーミッション設定とcrontabの設定を実行
#
# 機能：
# 1. スクリプトファイルの所有者とパーミッションの設定
#    - 所有者: ${SYSTEM_NAME}:${SYSTEM_NAME}
#    - パーミッション: 755
# 2. crontabの設定
#    - 既存のcrontabのバックアップ
#    - crontab.txtの内容を新しいcrontabとして設定
#    - ##SYSTEM_NAME##を${SYSTEM_NAME}の値に置換
#
# 使用方法：
# ./setup.sh
#
# 依存ファイル：
# - crontab.txt: 設定するcrontabの内容
#
# 環境変数：
# - SYSTEM_NAME: システム名
#
# 注意事項：
# - root権限（sudo）が必要です
# - 実行前にcrontab.txtが存在することを確認してください
# - 既存のcrontabは自動的にバックアップされます
# - スクリプトは /var/${SYSTEM_NAME}/sbin/sv_scripts 配下の
#   すべての.shファイルに適用されます
# ====================================================

source ~/.bash_profile

# スクリプトのパスを設定
SCRIPT_DIR="/var/${SYSTEM_NAME}/sbin/sv_scripts"


# スクリプトの所有者とパーミッションを設定
echo "スクリプトの所有者とパーミッションを設定します..."
chown ${USER_NAME}:${USER_NAME} ${SCRIPT_DIR}/*.sh
chmod 755 ${SCRIPT_DIR}/*.sh

# crontabの設定
echo "crontabの設定を行います..."
if [ -f "${SCRIPT_DIR}/crontab.txt" ]; then
    # 既存のcrontabをバックアップ
    crontab -l > ${SCRIPT_DIR}/crontab.backup 2>/dev/null || true
    
    # SYSTEM_NAMEを置換して一時ファイルを作成
    sed "s/##SYSTEM_NAME##/${SYSTEM_NAME}/g" ${SCRIPT_DIR}/crontab.txt > ${SCRIPT_DIR}/crontab.tmp
    
    # 新しいcrontabを設定
    crontab ${SCRIPT_DIR}/crontab.tmp
    
    # 一時ファイルを削除
    rm ${SCRIPT_DIR}/crontab.tmp
    
    if [ $? -eq 0 ]; then
        echo "crontabの設定が完了しました。"
        echo "現在のcrontabの内容:"
        crontab -l
    else
        echo "エラー: crontabの設定に失敗しました。"
        exit 1
    fi
else
    echo "エラー: ${SCRIPT_DIR}/crontab.txt が見つかりません。"
    exit 1
fi

echo "セットアップが完了しました。"
