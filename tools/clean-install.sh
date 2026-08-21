#!/bin/bash

echo "クリーンインストールを開始します..."

echo "1. 削除対象のフォルダを表示します..."
echo
echo "削除対象フォルダ:"
if [ -d ".turbo" ]; then echo "- ./.turbo"; fi
if [ -d ".next" ]; then echo "- ./.next"; fi
if [ -d "dist" ]; then echo "- ./dist"; fi
if [ -d "node_modules" ]; then echo "- ./node_modules"; fi
if [ -f "pnpm-lock.yaml" ]; then echo "- ./pnpm-lock.yaml"; fi

echo
echo "サブディレクトリ内の削除対象:"
for dir in */; do
    if [ "$dir" != "node_modules/" ]; then
        if [ -d "${dir}.turbo" ]; then echo "- ${dir}.turbo"; fi
        if [ -d "${dir}.next" ]; then echo "- ${dir}.next"; fi
        if [ -d "${dir}dist" ]; then echo "- ${dir}dist"; fi
        if [ -d "${dir}node_modules" ]; then echo "- ${dir}node_modules"; fi
        if [ -f "${dir}pnpm-lock.yaml" ]; then echo "- ${dir}pnpm-lock.yaml"; fi
        
        for subdir in "${dir}"*/; do
            if [ "$subdir" != "node_modules/" ]; then
                if [ -d "${subdir}.turbo" ]; then echo "- ${subdir}.turbo"; fi
                if [ -d "${subdir}.next" ]; then echo "- ${subdir}.next"; fi
                if [ -d "${subdir}dist" ]; then echo "- ${subdir}dist"; fi
                if [ -d "${subdir}node_modules" ]; then echo "- ${subdir}node_modules"; fi
                if [ -f "${subdir}pnpm-lock.yaml" ]; then echo "- ${subdir}pnpm-lock.yaml"; fi
            fi
        done
    fi
done

echo
read -p "上記のフォルダとファイルを削除します。よろしいですか？ (y/n): " confirm
if [ "$confirm" != "y" ]; then
    echo "処理を中止しました。"
    exit 0
fi

echo
echo "1. .turbo, .next, dist フォルダを削除します..."
[ -d ".turbo" ] && rm -rf .turbo
[ -d ".next" ] && rm -rf .next
[ -d "dist" ] && rm -rf dist

echo "1-1. サブディレクトリ内の.turbo, .next, dist フォルダを削除します..."
for dir in */; do
    if [ "$dir" != "node_modules/" ]; then
        [ -d "${dir}.turbo" ] && rm -rf "${dir}.turbo"
        [ -d "${dir}.next" ] && rm -rf "${dir}.next"
        [ -d "${dir}dist" ] && rm -rf "${dir}dist"
        
        for subdir in "${dir}"*/; do
            if [ "$subdir" != "node_modules/" ]; then
                [ -d "${subdir}.turbo" ] && rm -rf "${subdir}.turbo"
                [ -d "${subdir}.next" ] && rm -rf "${subdir}.next"
                [ -d "${subdir}dist" ] && rm -rf "${subdir}dist"
            fi
        done
    fi
done

echo "2. node_modules と pnpm-lock.yaml を削除します..."
[ -d "node_modules" ] && rm -rf node_modules
[ -f "pnpm-lock.yaml" ] && rm -f pnpm-lock.yaml

echo "2-1. サブディレクトリ内のnode_modulesとpnpm-lock.yamlを削除します..."
for dir in */; do
    if [ "$dir" != "node_modules/" ]; then
        [ -d "${dir}node_modules" ] && rm -rf "${dir}node_modules"
        [ -f "${dir}pnpm-lock.yaml" ] && rm -f "${dir}pnpm-lock.yaml"
        
        for subdir in "${dir}"*/; do
            if [ "$subdir" != "node_modules/" ]; then
                [ -d "${subdir}node_modules" ] && rm -rf "${subdir}node_modules"
                [ -f "${subdir}pnpm-lock.yaml" ] && rm -f "${subdir}pnpm-lock.yaml"
            fi
        done
    fi
done

echo "3. pnpm store prune を実行します..."
pnpm store prune
if [ $? -ne 0 ]; then
    echo "pnpm store prune の実行に失敗しました。"
    exit 1
fi

echo "4. pnpm install を実行します..."
pnpm install
if [ $? -ne 0 ]; then
    echo "pnpm install の実行に失敗しました。"
    exit 1
fi

echo "クリーンインストールが完了しました。" 