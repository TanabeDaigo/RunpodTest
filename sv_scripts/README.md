# sv_scripts

プロジェクト管理用共通スクリプト

## 事前準備

```bash
npm install -g pnpm
npm install -g forever
```

## 環境構築手順

プロジェクト名はmetrojsのところは各プロジェクトで修正してください

#### 環境変数を設定

vi ~/.bash_profile で下記を修正

```
# .bash_profile

# Get the aliases and functions
if [ -f ~/.bashrc ]; then
        . ~/.bashrc
fi

## ↓を追加
PATH=$PATH:$HOME/.local/bin:$HOME/bin::/var/metrojs/sbin/sv_scripts/
export PATH

# User specific environment and startup programs
## ↓を追加
PROJECT_NAME=webapp
IS_STAGING=true
IS_DB=true
ENV_NAME=検証
SYSTEM_NAME=metrojs
SERVICE_NAME=MetroJs検証環境
```

#### metroユーザーでフォルダ移動

```
su - metrojs
cd /home/metrojs
```

#### ssh-agent を起動、キー作成・登録

```
eval $(ssh-agent)
※止める場合、ssh-agent -k コマンドを実行する

; キー作成
ssh-keygen -t ed25519 -b 4096 -C "github" -f ~/.ssh/github
PW：metrojs1203
ssh-add ~/.ssh/github
※削除する場合は ssh-add -D ~/.ssh/github

; ↓公開鍵をGitHubに登録する　・・・★　Github.com → 対象プロジェクト → Settings→Deploy keys
cat /home/metrojs/.ssh/github.pub ; 内容を表示する
```

#### 設定を登録する

vi ~/.ssh/config

```
Host github.com
HostName github.com
IdentityFile ~/.ssh/github
User metrojs
```

#### 権限変更

```
chmod 700 ~/.ssh
chmod 600 ~/.ssh/*
```

#### メールアドレス設定

```
git config --global user.email "alert@kronometro.jp"
git config --global user.name "kronometro"
```

#### APPフォルダ構築

rootユーザーで下記を実行

```
mkdir /var/metrojs
cd /var/metrojs
mkdir app
mkdir backup
mkdir logs
mkdir sbin
mkdir data
```

#### 権限、所有者の変更

```
chown -R metrojs:metrojs /var/metrojs
chmod -R 777 /var/metrojs/logs
```

#### sv_scriptsをエクスポート→Pull

```
cd /var/metrojs/sbin ; 指定フォルダに移動

git init ; 初期化

; リモートリポジトリ追加
git remote remove origin
git remote add origin https://github.com/Krono-Metro/metrojs.git
git remote set-url origin git@github.com:Krono-Metro/metrojs.git

; リポジトリの確認
git remote -v

; git config登録 ※指定フォルダをPullするようにする
git config core.sparsecheckout true
echo sv_scripts > .git/info/sparse-checkout

; 確認
cat .git/info/sparse-checkout
cat ./.git/config

; pull する
git pull origin main

; 権限を変更
chown metrojs:metrojs /var/metrojs/sbin/sv_scripts/*.sh

; 権限、クーロン等のセットアップ
./setup.sh
```

#### メニュー操作スクリプト（menu.sh）の使い方

```bash
./menu.sh
```
