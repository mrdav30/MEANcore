@ECHO OFF
rem "For any value containing & must be escaped with ^ i.e. ABC=M&M should be ABC=M^&M"
set "NODE_ENV=production"
set "DOMAIN="
set "AUTH_DOMAIN="

set "DB_RMS_NAME="
set "DB_RMS_USER="
set "DB_RMS_PASS="
set "DB_OPS_NAME="
set "DB_OPS_USER="
set "DB_OPS_PASS="

rem set 1 to enable
set "PPC_ENABLE_ROLE_PLAY=" 

set "PORT="
set "LOG_FORMAT="

chdir %~dp0

rem "rem is used for comments"
rem node ./server.js
rem npm start is always in development mode

npm start 

