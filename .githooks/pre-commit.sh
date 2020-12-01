script_dir=$(dirname $0)
cd $script_dir

echo >&2 "Unbundling development packages for commit".
bckupPkg=../modules/core/core.package.json
curPkg=../package.json
if test -f "$bckupPkg"; then
	cp -f $bckupPkg $curPkg 
fi