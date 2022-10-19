const {
    aggregateData,
    insertMany,
    findAndUpdateData,
    findAndDeleteData,
} = require('../dbInstance').getDB();

const {
    INVOICES,
} = require('../db/collections');

const {
    generateId,
    checkAllFieldsIn,
    getDueDate,
    getCreatedAt,
} = require('../utils');


const create = async ({ description, paymentTerms, status, clientName, clientEmail, senderAddress, clientAddress, items, total }) => {

    try {

        const invoice = {
            id: generateId(),
            createdAt: getCreatedAt(),
            paymentDue: getDueDate(+paymentTerms, new Date()),
            description,
            paymentTerms: +paymentTerms,
            status,
            clientName,
            clientEmail,
            senderAddress,
            clientAddress,
            items,
            total,
        };

        if (status === 'draft') {

            await insertMany(INVOICES, [invoice]);

            delete invoice._id;

            return {
                error: false,
                invoice,
            };

        };

        const addressFields = ['street', 'city', 'postCode', 'country'];

        const itemFields = ['name', 'quantity', 'price', 'total'];

        if (!checkAllFieldsIn(addressFields, senderAddress) || !checkAllFieldsIn(addressFields, clientAddress)) throw new Error('missing fields');

        if (items.length && items.some((item) => !checkAllFieldsIn(itemFields, item))) throw new Error('missing fields');

        await insertMany(INVOICES, [invoice]);

        delete invoice._id;

        return {
            error: false,
            invoice,
        };


    } catch (error) {

        throw new Error(error);

    }
};

const find = async ({ filter, limit = 10, page = 1 }) => {

    try {

        limit = +limit;

        page = +page;

        const skip = (page - 1) * limit;

        const aggregation = [
            {
                $match: filter,
            },
            {
                $sort: { paymentDue: 1 }
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            },
            {
                $project: {
                    _id: 0,
                }
            },
        ];

        const { result } = await aggregateData(INVOICES, aggregation);


        if ('id' in filter) {

            const invoice = result[0];

            return {
                error: false,
                invoice,
            };

        };

        const invoices = result;

        return {
            error: false,
            invoices,
        };

    } catch (error) {

        throw new Error(error);

    }
};

const update = async ({ }) => {

    try {

    } catch (error) {

        throw new Error(error);

    }

};

const findDelete = async ({ filter, options }) => {

    try {

        const { result } = await findAndDeleteData(INVOICES, filter, options);

        return {
            error: false,
            invoice: result?.value,
        };

    } catch (error) {

        throw new Error(error);

    }

};

const findUpdate = async ({ filter, update, options }) => {

    try {

        if (update.status === 'paid') {

            const { result } = await findAndUpdateData(INVOICES, filter, { $set: { ...update } }, options);

            return {
                error: false,
                invoice: result?.value,
            };

        };

        const addressFields = ['street', 'city', 'postCode', 'country'];

        const itemFields = ['name', 'quantity', 'price', 'total'];

        if (!checkAllFieldsIn(addressFields, update.senderAddress) || !checkAllFieldsIn(addressFields, update.clientAddress)) throw new Error('missing fields');

        if (update.items.length && update.items.some((item) => !checkAllFieldsIn(itemFields, item))) throw new Error('missing fields');


        const { result } = await findAndUpdateData(INVOICES, filter, { $set: { ...update, paymentDue: getDueDate(+update.paymentTerms, new Date(update.createdAt)), } }, options);

        return {
            error: false,
            invoice: result?.value,
        };

    } catch (error) {

        throw new Error(error);

    }

};


module.exports = {
    create,
    find,
    update,
    findUpdate,
    findDelete,
}