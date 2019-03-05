var fileExists = require('./helpers/file-exists'),
    flattenData = require('./helpers/flatten-data'),
    generateToken = require('./helpers/generate-token'),
    pager = require('./helpers/pager'),
    shiftKeyCase = require('./helpers/shift-key-case'),
    slugify = require('./helpers/slugify'),
    fileProxy = require('./helpers/file-proxy'),
    isBot = require('./helpers/isBot');

module.exports = {
    fileExists,
    flattenData,
    generateToken,
    pager,
    shiftKeyCase,
    slugify,
    fileProxy,
    isBot
};