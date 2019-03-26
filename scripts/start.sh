script_dir=$(dirname $0)
cd $script_dir
pm2 stop Core;  pm2 start ../server.js -i 0 --name MEANcore