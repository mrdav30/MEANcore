module.exports = keysToLowerCase;

function keysToLowerCase(obj, cb) {
    Object.keys(obj).forEach(function (key) {
        var k = key.toLowerCase();

        if (k !== key) {
            obj[k] = obj[key];
            delete obj[key];
        }
    });
    if (cb) {
        cb(null, obj);
    } else {
        return (obj);
    }
};
