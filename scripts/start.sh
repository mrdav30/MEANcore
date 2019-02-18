export "NODE_ENV=production"
export "DOMAIN="
export "AUTH_DOMAIN="

export "DB_NAME="
export "DB_USER="
export "DB_PASS="

export "PORT="
export "LOG_FORMAT="

script_dir=$(dirname $0)
cd $script_dir
pm2 stop Core;  pm2 start server.js -i 0 --name MEANcore