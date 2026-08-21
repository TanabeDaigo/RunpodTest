#!/bin/sh

#環境変数読みこみ
source ~/.bashrc
source ~/.bash_profile


#共通ファイル読込
source define.sh

echo "IS_STAGING:"$IS_STAGING
cd $SBIN_DIR

#ログファイル名
filename="menu.log_`date +%Y%m%d`"

#ログ出力先ディレクトリ
log_dir=$SCRIPTS_LOG_DIR

#ログ出力先ディレクトリが存在しない場合作成する
if [ ! -e $log_dir ]; then
  echo  "ログ出力ディレクトリを作成します"
  mkdir $log_dir
fi

#ログ出力
log="tee -a "$log_dir"/"$filename

# HTTP起動
start_web(){
  echo "start_web --------------------------------------------------------------------------------"  | $log
  read -p "WebServerを起動します。よろしいですか？ (y/N): " yn
  case "$yn" in [yY]*) ;;   *) echo "exit" ; exit ;; esac
  systemctl start nginx.service
}

# HTTP停止
stop_web(){
  echo "stop_web --------------------------------------------------------------------------------"  | $log
  
  read -p "WebServerを停止します。よろしいですか？ (y/N): " yn
  case "$yn" in [yY]*) ;;   *) echo "exit" ; exit ;; esac
  systemctl stop nginx.service
}

# HTTP再起動
restart_web(){
  echo "restart_web --------------------------------------------------------------------------------"  | $log
  
  read -p "WebServerを再起動します。よろしいですか？ (y/N): " yn
  case "$yn" in [yY]*) ;;   *) echo "exit" ; exit ;; esac
  systemctl restart nginx.service
}

# DB開始
start_db(){
  echo "start_db --------------------------------------------------------------------------------"  | $log
  
  read -p "DataBaseを起動します。よろしいですか？ (y/N): " yn
  case "$yn" in [yY]*) ;;   *) echo "exit" ; exit ;; esac
  #sudo  systemctl start postgresql
  systemctl start mysqld
}

# DB停止
stop_db(){
  echo "stop_db --------------------------------------------------------------------------------"  | $log
  
  read -p "DataBaseを停止します。よろしいですか？ (y/N): " yn
  case "$yn" in [yY]*) ;;   *) echo "exit" ; exit ;; esac
  #sudo  systemctl stop postgresql
  systemctl stop mysqld
}

# DB再起動
restart_db(){
  echo "restart_db --------------------------------------------------------------------------------"  | $log
  
  read -p "DataBaseを再起動します。よろしいですか？ (y/N): " yn
  case "$yn" in [yY]*) ;;   *) echo "exit" ; exit ;; esac
  #sudo  systemctl restart postgresql
  systemctl restart mysqld
}

# エクスポート
export_diff(){
  echo "export_diff  --------------------------------------------------------------------------------"  | $log
  ./export.sh 0 0 0 | $log  
}

# エクスポート
export_all(){
  echo "export_all  --------------------------------------------------------------------------------"  | $log
  ./export.sh 1 0 0 | $log
}

# コンパイル
compile_app(){
  echo "compile_app  --------------------------------------------------------------------------------"  | $log
  ./compile.sh 0 | $log
}


npm_install(){
  echo "npm_install --------------------------------------------------------------------------------"  | $log

  ./npm_install.sh 0 | $log
}

# 事前コンパイル
update_before(){

  echo "update_before ${1} --------------------------------------------------------------------------------"  | $log

  # 差分エクスポート
  if [ ${1} = "main" ]; then
    ./export.sh 0 0 1 1 | $log  
  else
    if [ ${1} = "staging" ]; then
      ./export.sh 1 0 1 1 | $log  
    else
      ./export.sh 2 0 1 1 | $log  
    fi
  fi
  
  # コンパイル
  if [ ${1} = "main" ]; then
    ./compile.sh 0 1 | $log
  else
    if [ ${1} = "staging" ]; then
      ./compile.sh 1 1 | $log
    else
      ./compile.sh 2 1 | $log
    fi
  fi

}

clear_cache(){

  echo "clear_cache ${1} --------------------------------------------------------------------------------"  | $log
  ./clear_cache.sh ${1}
}


update_app(){
  echo "update_app --------------------------------------------------------------------------------"  | $log
  # HTTP停止
  systemctl stop nginx.service
  #stop_web;

  # アプリ停止
  ./stop.sh 1 | $log 

  # 全てエクスポート
  ./export.sh 1 1 1 | $log  
  
  # コンパイル
  ./compile.sh 1 | $log

  # HTTP起動
  systemctl start nginx.service
  #start_web;

  # アプリ起動
  ./start.sh 1 | $log

  #tail -f ${LOG_FILE}
}

## 状態表示
show_status(){
#  echo "show_status --------------------------------------------------------------------------------"  | $log

  echo "WEBサービス -------------------------------"
  systemctl status nginx | grep Active

  echo "DBサービス --------------------------------"
  systemctl status mysqld | grep Active
  
 # echo "メールサービス ----------------------------"
 # systemctl status postfix.service | grep Active

 # echo "redis サービス ----------------------------"
 # systemctl status redis | grep Active

  echo "forever list ------------------------------"
  forever list

  echo "ps aux | grep node ------------------------"
  ps aux | grep node 
  echo ""
  
}

# アプリ起動
start_app(){
  echo "start_app --------------------------------------------------------------------------------"  | $log
  ./start.sh 0 | $log

  ./tail.sh}

# アプリ停止
stop_app(){
  echo "stop_app --------------------------------------------------------------------------------"  | $log
  ./stop.sh 0 | $log 

}

# アプリ再起動
restart_app(){
  echo "restart_app --------------------------------------------------------------------------------"  | $log
  ./stop.sh 1 | $log
  ./start.sh 1 | $log

    ./tail.sh

}


# tail
tail_log(){
  echo "tail_log --------------------------------------------------------------------------------"  | $log
  ./tail.sh | $log

}

# バックアップ
backup_db(){
  echo "backup_db --------------------------------------------------------------------------------"  | $log
}

# ブランチを切り替える
switch_branch(){
  echo "switch_branch --------------------------------------------------------------------------------"  | $log

  ./stop.sh 1 | $log
  ./switch_branch.sh 0
 # ./start.sh 1 | $log
}

show_status;
echo "■"$SERVICE_NAME" -- MENU --"$ENV_NAME
echo 
echo "[1] WebServer起動"
echo "[2] WebServer停止"
echo "[3] WebServer再起動"
echo "[4] サービス状況確認"

if [ $IS_DB = true ]; then
echo "[10] Database起動"
echo "[11] Database停止"
echo "[12] Database再起動"
fi

echo ""
echo "稼働中 branch: "${ACTIVE_BRANCH}
echo ""

is_staging=$IS_STAGING

echo "[20] 差分エクスポート"
echo "[21] 全てエクスポート"
echo "[22] アプリコンパイル"
echo "[23] npm install(ci)"
echo "[24] AppUpdate(停止、エクスポート、コンパイル、起動)"
echo "[25] キャッシュクリア"
echo ""
echo "[30] アプリ起動"
echo "[31] アプリ停止"
echo "[32] アプリ再起動"
echo "[33] ログをTail"

if [ $IS_DB = true ]; then
echo "[50] DBバックアップ"
fi

echo ""
echo "[90] branchを切り替える"
echo ""

echo "[Q] Menu終了"
echo -n "メニューを選択(Q): "
read ans


case $ans in
1)   start_web;;
2)   stop_web;;
3)   restart_web;;
4)   show_status;;

10)   start_db;;
11)   stop_db;;
12)   restart_db;;

20)   export_diff ;;
21)   export_all ;;
22)   compile_app ;;
23)   npm_install ;;
24)   update_app ;;
25)   clear_cache 1;;

30)   start_app;;
31)   stop_app;;
32)   restart_app;;
33)   tail_log;;

50)   backup_db;;

90)   switch_branch;;

Q | q)
     echo "Menuを終了します" ;;
*)
     echo "メニューが存在しません" ;;

esac
