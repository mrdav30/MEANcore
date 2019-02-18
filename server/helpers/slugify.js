var _ = require('lodash');

module.exports = slugify;

// convert string into slug
function slugify(input) {
    if (!input){
        return;
    }

    // make lower case and trim
    var slug = _.lowerCase(_.trim(input));

    // replace invalid chars with spaces
    slug = _.replace(slug, /[^a-z0-9\s-]/g, ' ');

    // replace multiple spaces or hyphens with a single hyphen
    slug = _.replace(slug, /[\s-]+/g, '-');

    return slug;
};