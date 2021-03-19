//  This script combines the core package json with each mods package.json.
//  **Note: The purpose of this file is stricly for development/build purposes.  
//  The generated core.package.json file will override upon commit.

import fse from 'fs-extra';
import _ from 'lodash';
import chalk from 'chalk';

import bundleConfig from './config.init.js';

const errorFactory = msg => Promise.reject(new Error(`::package-json-compose::Error:: ${msg}`));

const DEPENDENCY_TYPES = new Set(['dependencies', 'devDependencies', 'peerDependencies']);

const LEFT = 'LEFT';
const RIGHT = 'RIGHT';
const STRIP_NON_NUMERICS = /[^a-zA-Z0-9 ]/g;

const build = async ({
  dependencies,
  outputs
}) => {
  if (_.isEmpty(dependencies)) {
    return errorFactory('Missing required property dependencies');
  }

  if (typeof outputs !== 'object') {
    return errorFactory('Must provide output paths for desired package.json')
  }

  if (_.isEmpty(bundleConfig.PKG_DEP_TYPES) || _.isEmpty(_.pick(bundleConfig.PKG_DEP_TYPES, Array.from(DEPENDENCY_TYPES)))) {
    return errorFactory(`Must provide at least one of package.json dependency types: ${Array.from(DEPENDENCY_TYPES)}`);
  }

  console.log(chalk.cyan("Bundling linked packages"));

  const mappedDependencies = _.map(dependencies, (key) => key);

  await Promise.all(mappedDependencies.map(async (url) => {
    return fse.readFile(url);
  })).then(async (deps) => {
    const parsedDependencies = await parse(deps);
    const filteredDependencies = await filter(bundleConfig.PKG_BLK_LIST, parsedDependencies);
    const dedupedDependencies = await dedupe(bundleConfig.PKG_DEP_TYPES, filteredDependencies);

    //  console.log(chalk.magenta(`::package-json-compose::Generating\n${config.stringify(dedupedDependencies)}`));

    await compose(outputs, dedupedDependencies);
  })
}

const parse = async (data) => _.map(data, (text) => {
  const result = JSON.parse(text);

  const {
    dependencies = {}, devDependencies = {}, peerDependencies = {}
  } = result;
  return {
    dependencies,
    devDependencies,
    peerDependencies
  };
});

const filter = async (blacklist, parsedDependencies) => {
  return _.map(parsedDependencies, (packagedDependencies) => {
    return _.reduce(packagedDependencies, (result, m, k) => {
      const dependencies = _.omit(packagedDependencies[k], blacklist);
      result[k] = dependencies;
      return result;
    }, {})
  });
};

const getTypes = (types) => {
  const isInTypes = (t) => {
    return DEPENDENCY_TYPES.has(t);
  };
  const isAllowed = (dependencyType) => {
    return !!types[dependencyType];
  };

  let test = _.filter(_.filter(_.keys(types), (type) => isAllowed(type)), (t) => isInTypes(t));

  return test;
};

const parseVersion = (str) => str.split('.').map(s => s.replace(STRIP_NON_NUMERICS, '')).map(s => parseInt(s, 10));

const getSemVer = (versionArr) => {
  const [major, minor, patch] = versionArr;
  return {
    major,
    minor,
    patch,
  };
};

const determineLargerVersion = (l, r) => {
  const leftSemVer = getSemVer(l);
  const rightSemVer = getSemVer(r);

  if (leftSemVer.major > rightSemVer.major) {
    return LEFT;
  } else if (rightSemVer.major > leftSemVer.major) {
    return RIGHT;
  }

  if (leftSemVer.minor > rightSemVer.minor) {
    return LEFT;
  } else if (rightSemVer.minor > leftSemVer.minor) {
    return RIGHT;
  }

  if (leftSemVer.patch > rightSemVer.patch) {
    return LEFT;
  }

  return RIGHT;
};

const dedupe = async (types, filteredDependencies) => {
  const allowedTypes = getTypes(types);

  const parseLatestVersion = (l, r) => {
    if (!l || !r) {
      return l ? l : r;
    }

    const leftVersion = parseVersion(l);
    const rightVersion = parseVersion(r);
    const higher = determineLargerVersion(leftVersion, rightVersion);

    if (higher === LEFT) {
      return l;
    }

    return r;
  };

  const getLatestVersion = (l, r) => {
    return _.mergeWith(l, r, parseLatestVersion)
  };

  return _.reduce(filteredDependencies, (result, dependencies) => {
    const picked = _.pick(dependencies, allowedTypes);
    // NOTE: if it already exists, take the latest one
    result = _.mergeWith(result, picked, getLatestVersion);
    return result;
  }, {});
};

const write = async (output, fileContents) => {
  await bundleConfig.writeFilePromise(output, bundleConfig.stringify(fileContents), 'utf-8').then(() => fileContents);
}

// Non-destructive to all other package.json properties
const compose = async (outputs, fileContents) => {
  for (let output of outputs) {
    bundleConfig.readFilePromise(output)
      .then(async (data) => {
        let parsed;

        try {
          parsed = JSON.parse(data);
        } catch (e) {
          parsed = {};
        }

        const dupeKeys = (l, r) => r;
        const merged = _.mergeWith(parsed, fileContents, dupeKeys);

        console.log(chalk.cyan("Linked package.json created at: " + output));

        await write(output, merged)
      })
  }
}

bundleConfig.init(() => {
  const dependencies = {
    core: bundleConfig.LINK_CORE_PKG
  };

  const outputs = [
    bundleConfig.LINK_CORE_PKG
  ];

  // back up unbundled package files
  if (fse.existsSync(bundleConfig.CORE_PKG_BKP)) {
    // Overwrite current core package.json with back up!
    fse.copyFileSync(bundleConfig.CORE_PKG_BKP, bundleConfig.LINK_CORE_PKG);
  } else {
    // Back up current core package.json
    fse.copyFileSync(bundleConfig.LINK_CORE_PKG, bundleConfig.CORE_PKG_BKP);
  }

  _.forEach(bundleConfig.ALL_MODULES, (mod) => {
    dependencies[mod.APP_NAME] = mod.LINK_MOD_PKG;
    outputs.push(mod.LINK_MOD_PKG);

    if (fse.existsSync(mod.MOD_PKG_BKP)) {
      // Overwrite module package.json with back up!
      fse.copyFileSync(mod.MOD_PKG_BKP, mod.LINK_MOD_PKG);
    } else {
      // Back up current module package.json
      fse.copyFileSync(mod.LINK_MOD_PKG, mod.MOD_PKG_BKP);
    }
  });

  build({
      dependencies,
      outputs
    }).then(() => {
      console.log(chalk.cyan("Bundling linked packages complete"))
    })
    .catch((err) => {
      console.log(chalk.red(err));
    });
});
