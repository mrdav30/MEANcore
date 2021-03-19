import _ from 'lodash';

export async function renameKeys(obj, mod) {
  obj[mod.APP_NAME] = obj['{{mod}}'];
  delete obj['{{mod}}'];
  obj[mod.APP_NAME + '-e2e'] = obj['{{mod}}-e2e'];
  delete obj['{{mod}}-e2e'];
}

export async function replacePropertyValues(obj, mod) {
  const newObject = _.clone(obj);

  await _.each(obj, async (val, key) => {
    if (typeof (val) === 'object') {
      newObject[key] = await replacePropertyValues(val, mod);
    } else if (_.includes(val, '{{mod}}')) {
      newObject[key] = _.replace(val, new RegExp("{{mod}}", "g"), mod.APP_NAME);
    }
  })

  return newObject
}