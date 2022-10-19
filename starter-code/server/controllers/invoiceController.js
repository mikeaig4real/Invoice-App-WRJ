const {
    StatusCodes,
} = require('http-status-codes');

const INVOICE = require('../models/Invoice.js');

const {
    checkFalsyFieldsObj,
    checkFalsyFieldsArr,
} = require('../utils');

const addInvoice = async (req, res) => {

    const { description, paymentTerms, clientName, clientEmail, status, senderAddress, clientAddress, items } = { ...req.params, ...req.query, ...req.body };

    if (!status) {

        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({
                error: true,
                message: 'missing fields'
            });

    };

    if (!['draft', 'pending'].includes(status)) {

        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({
                error: true,
                message: 'invalid status'
            });

    };

    try {

        const total = items.reduce((acc, { total }) => {
            acc += total;
            return acc;
        }, 0);

        if (status === 'draft') {

            const { invoice } = await INVOICE.create({ description, paymentTerms, status, clientName, clientEmail, senderAddress, clientAddress, items, total });

            return res
                .status(StatusCodes.OK)
                .json({
                    error: false,
                    message: 'invoice created successfully',
                    invoice,
                });

        };

        if (!checkFalsyFieldsArr([description, paymentTerms, clientName, clientEmail, status, senderAddress, clientAddress, items])) {

            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    error: true,
                    message: 'missing fields'
                });

        };

        if (!checkFalsyFieldsObj(senderAddress) || !checkFalsyFieldsObj(clientAddress)) {

            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    error: true,
                    message: 'missing fields'
                });

        }

        const { invoice } = await INVOICE.create({ description, paymentTerms, status, clientName, clientEmail, senderAddress, clientAddress, items, total });

        return res
            .status(StatusCodes.OK)
            .json({
                error: false,
                message: 'invoice created successfully',
                invoice,
            });

    } catch (error) {

        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(error);

    }

}

const getInvoice = async (req, res) => {

    const { id, status, limit, page } = { ...req.params, ...req.query, ...req.body };

    try {

        if (id) {

            const { invoice } = await INVOICE.find({ filter: { id }, limit, page });

            if (!invoice) {

                return res
                    .status(StatusCodes.NOT_FOUND)
                    .json({
                        error: true,
                        message: 'invoice not found'
                    });

            }

            return res
                .status(StatusCodes.OK)
                .json({
                    error: false,
                    message: 'invoice retrieved successfully',
                    invoice,
                });

        };

        if (status && !["pending", "draft", "paid"].includes(status)) {

            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    error: true,
                    message: 'invalid status'
                });

        };

        const { invoices } = await INVOICE.find({ filter: { ...(status && { status }) }, limit, page });

        return res
            .status(StatusCodes.OK)
            .json({
                error: false,
                message: 'invoices retrieved successfully',
                invoices,
            });


    } catch (error) {

        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(error);

    }

};

const updateInvoice = async (req, res) => {

    const { id, invoice: prevInvoice, markAsPaid } = { ...req.params, ...req.query, ...req.body };


    if (!id) {

        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({
                error: true,
                message: 'missing fields'
            });

    };

    try {

        if (markAsPaid) {

            const { invoice } = await INVOICE.findUpdate({ filter: { id }, update: { status: 'paid' }, options: { returnDocument: "after", projection: { _id: 0 } } });

            if (!invoice) {

                return res
                    .status(StatusCodes.NOT_FOUND)
                    .json({
                        error: true,
                        message: 'invoice not found'
                    });

            };

            return res
                .status(StatusCodes.OK)
                .json({
                    error: false,
                    message: 'invoice updated successfully',
                    invoice,
                });

        };

        const { description, paymentTerms, clientName, clientEmail, status, senderAddress, clientAddress, items } = prevInvoice;

        if (!checkFalsyFieldsArr([description, paymentTerms, clientName, clientEmail, status, senderAddress, clientAddress, items])) {

            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    error: true,
                    message: 'missing fields'
                });

        };

        if (!checkFalsyFieldsObj(senderAddress) || !checkFalsyFieldsObj(clientAddress)) {

            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    error: true,
                    message: 'missing fields'
                });

        };

        const total = items.reduce((acc, { total }) => {
            acc += total;
            return acc;
        }, 0);


        const { invoice } = await INVOICE.findUpdate({ filter: { id }, update: { ...prevInvoice, status: 'pending', total }, options: { returnDocument: "after", projection: { _id: 0 } } });

        if (!invoice) {

            return res
                .status(StatusCodes.NOT_FOUND)
                .json({
                    error: true,
                    message: 'invoice not found'
                });

        };

        return res
            .status(StatusCodes.OK)
            .json({
                error: false,
                message: 'invoice updated successfully',
                invoice,
            });

    } catch (error) {

        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(error);

    }

}

const deleteInvoice = async (req, res) => {

    const { id } = { ...req.params, ...req.query, ...req.body };

    if (!id) {

        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({
                error: true,
                message: 'missing fields'
            });

    };

    try {

        const { invoice } = await INVOICE.findDelete({ filter: { id }, options: { projection: { _id: 0 } } });

        if (!invoice) {

            return res
                .status(StatusCodes.NOT_FOUND)
                .json({
                    error: true,
                    message: 'invoice not found'
                });

        };

        return res
            .status(StatusCodes.OK)
            .json({
                error: false,
                message: 'invoice deleted successfully',
                invoice,
            });

    } catch (error) {

    }

}



module.exports = {
    addInvoice,
    getInvoice,
    updateInvoice,
    deleteInvoice,
};