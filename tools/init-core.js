import cp from 'child_process';

const install = () => {
  if (process.argv[2] === 'core') {
    console.log('Setting new git hooksPath : ', process.cwd() + '\\.githooks');
    cp.exec('git config core.hooksPath ' + process.cwd() + '\\.githooks');

    console.log('Setting npm core_prj_root :', process.cwd());
    cp.exec('npm config set core_prj_root ' + process.cwd());

    console.log('Need to install dotenv...for now');
    cp.exec('npm install dotenv');
  } else{
    console.log('Setting new git hooksPath : %npm_config_core_prj_root%\\.githooks');
    cp.exec('git config core.hooksPath %npm_config_core_prj_root%\\.githooks');
  }

  return 1;
}

install();
