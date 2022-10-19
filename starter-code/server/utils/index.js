const randomstring = require('randomstring');

const moment = require('moment');

const checkFalsyFieldsObj = (obj) => {

    for (let key in obj) {

        if (!obj[key]) return false;

    };

    return true;

};

const checkFalsyFieldsArr = (arr) => {

    for (let val of arr) {

        if (!val) {

            return false;
            
        }

    };

    return true;

};

const checkAllFieldsIn = (fields, obj) => {

    for (let key of fields) {

        if (!( key in obj)) return false;

    };

    return true;

};

const generateId = () => `${randomstring.generate({ length: 2, capitalization: 'uppercase', charset: 'alphabetic' })}${randomstring.generate({ length: 4, charset: 'numeric' })}`;

const getDueDate = (terms, createdAt) => {

    return moment(createdAt).add(+terms, 'days').format('YYYY-MM-DD');

};

const getCreatedAt = () => {

    return moment().format('YYYY-MM-DD');

};


module.exports = {
    checkFalsyFieldsArr,
    checkFalsyFieldsObj,
    checkAllFieldsIn,
    generateId,
    getDueDate,
    getCreatedAt,
}