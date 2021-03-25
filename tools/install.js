import cp from 'child_process';

const install = () => {
  cp.exec('git config core.hooksPath .githooks');

  cp.exec('npm config set core_prj_root F:\\webdevrepos\\meancore');

  cp.exec('npm install dotenv');

  return 1;
}

install();
