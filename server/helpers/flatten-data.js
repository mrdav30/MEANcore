var moment = require('moment');

module.exports = {
    flattenData,
    flattenNumberData,
    flattenDateData
}

// Flatten the array of object to array of ids
function flattenData(collection, key) {
    key = key || 'ID';
    if (collection && collection.length) {
        return collection.map(el => {
            return typeof el === 'object' ? el[key] : el;
        });
    } else {
        return [null]; // Oracledb driver cant take empty array and must pass array. package must handle null
    }
};

// Flatten the array of object to array of numbers
function flattenNumberData(collection, key) {
    key = key || 'ID';
    if (collection && collection.length) {
        return collection.map(el => {
            let result = typeof el === 'object' ? el[key] : el;
            if (result === null) {
                return null;
            }
            return isNaN(result) ? result : +result;
        });
    } else {
        return [null]; // Oracledb driver cant take empty array and must pass array. package must handle null
    }
};

// Flatten the array of object to array of dates
function flattenDateData(collection, key) {
    key = key || 'ID';
    if (collection && collection.length) {
        return collection.map(el => {
            let result = typeof el === 'object' ? el[key] : el;
            if (!result) {
                return null;
            }
            return moment(result).format('DD-MMM-YYYY');
        });
    } else {
        return [null]; // Oracledb driver cant take empty array and must pass array. package must handle null
    }
};