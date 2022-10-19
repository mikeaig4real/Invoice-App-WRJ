const router = require('express').Router();

const {
    addInvoice,
    getInvoice,
    updateInvoice,
    deleteInvoice,
} = require('../controllers/invoiceController.js');

router
    .route('/')
    .get(getInvoice)
    .post(addInvoice)
    .patch(updateInvoice)
    .delete(deleteInvoice);

module.exports = router;