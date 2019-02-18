export "NODE_ENV=production"
export "DOMAIN="
export "AUTH_DOMAIN="

export "DB_RMS_NAME="
export "DB_RMS_USER="
export "DB_RMS_PASS="

export "PORT="
export "LOG_FORMAT="

script_dir=$(dirname $0)
cd $script_dir
pm2 stop Core;  pm2 start server.js -i 0 --name Core