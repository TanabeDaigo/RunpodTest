@echo off
chcp 65001

echo "カレントディレクトリに移動"
cd %~d0%~p0

echo "PATHを設定"
SET PATH=%PATH%;%USERPROFILE%\AppData\Roaming\nvm;C:\Program Files\Redis

cmd /k nvm use 22.11.0 

