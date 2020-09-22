import {
  join
} from 'path';
import util from 'util';
import fse from 'fs-extra';
import _ from 'lodash';
import chalk from 'chalk';

import config from './config.js';

const output = join(config.PROJECT_ROOT, './package.json');

const blacklist = [];

const types = {
  dependencies: true,
  devDependencies: true,
  peerDependencies: false
};

const errorFactory = msg => Promise.reject(new Error(`::package-json-compose::Error:: ${msg}`));

const DEPENDENCY_TYPES = new Set(['dependencies', 'devDependencies', 'peerDependencies']);
const LEFT = 'LEFT';
const RIGHT = 'RIGHT';
const STRIP_NON_NUMERICS = /[^a-zA-Z0-9 ]/g;

const stringify = (indentation, dependencyMap) => JSON.stringify(dependencyMap, null, indentation);

const build = async ({
  dependencies,
  output,
  types = {},
  blacklist = [],
  indentation = 2
}) => {
  if (_.isEmpty(dependencies)) {
    return errorFactory('Missing required property dependencies');
  }

  if (typeof output !== 'string') {
    return errorFactory('Must provide output path for desired package.json')
  }

  if (_.isEmpty(types) || _.isEmpty(_.pick(types, Array.from(DEPENDENCY_TYPES)))) {
    return errorFactory(`Must provide at least one of package.json dependency types: ${Array.from(DEPENDENCY_TYPES)}`);
  }

  const mappedDependencies = _.map(dependencies, (key) => key);

  await Promise.all(mappedDependencies.map(async (url) => {
    return fse.readFile(url);
  })).then(async (deps) => {
    const parsedDependencies = await parse(deps);
    const filteredDependencies = await filter(blacklist, parsedDependencies);
    const dedupedDependencies = await dedupe(types, filteredDependencies);

   // console.log(chalk.magenta(`::package-json-compose::Generating\n${stringify(indentation, dedupedDependencies)}`));

    await compose(output, indentation, dedupedDependencies);
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

const readFilePromise = util.promisify(fse.readFile);
const writeFilePromise = util.promisify(fse.writeFile);

const write = (output, indentation, fileContents) => {
  writeFilePromise(output, stringify(indentation, fileContents), 'utf-8').then(() => fileContents);
}

// Non-destructive to all other package.json properties
const compose = async (output, indentation, fileContents) => {
  readFilePromise(output)
    .then((data) => {
      let parsed;

      try {
        parsed = JSON.parse(data);
      } catch (e) {
        parsed = {};
      }

      const dupeKeys = (l, r) => r;
      const merged = _.mergeWith(parsed, fileContents, dupeKeys);

      return write(output, indentation, merged);
    });
}

config.init(() => {

  const dependencies = {
    core: join(config.PROJECT_ROOT, config.CORE_PKG)
  };

  _.forEach(config.ALL_MODULES, (mod) => {
    dependencies[mod.APP_TAG_NAME] = join(config.PROJECT_ROOT, mod.CHILD_PKG);
  });

  build({
    dependencies,
    output,
    types,
    blacklist
  }).catch((err) => {
    console.log(chalk.red(err));
  });
});
