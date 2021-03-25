import cp from 'child_process';

const install = () => {

  console.log(process.argv)

  cp.exec('git config core.hooksPath F:\\webdevrepos\\meancore\\.githooks');

  cp.exec('npm config set core_prj_root F:\\webdevrepos\\meancore');

  if(process.argv[3] === 'core'){
    cp.exec('npm install dotenv');
  }
  
  return 1;
}

install();
