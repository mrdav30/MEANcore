import cp from 'child_process';

cp.exec('git config core.hooksPath .githooks');
cp.exec('npm config set core_prj_root F:\\webdevrepos\\meancore');