import randomstring from 'randomstring';

import moment from 'moment';

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

const generateId = () => {
    const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let alphaCount = 0;
    const numeral = '0123456789';
    let result = '';
    while (result.length < 6) {
        if (alphaCount < 2) result += alpha[Math.floor(Math.random() * alpha.length)];
        alphaCount++;
        if (alphaCount < 2) continue;
        result += numeral[Math.floor(Math.random() * numeral.length)];
    };
    return result;
}

const getDueDate = (terms, createdAt) => {

    return moment(createdAt).add(+terms, 'days').format('YYYY-MM-DD');

};

const getCreatedAt = () => {

    return moment().format('YYYY-MM-DD');

};


export default {
    checkFalsyFieldsArr,
    checkFalsyFieldsObj,
    checkAllFieldsIn,
    generateId,
    getDueDate,
    getCreatedAt,
}