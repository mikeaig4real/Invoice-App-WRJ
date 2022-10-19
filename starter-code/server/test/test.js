const chai = require('chai');

const assert = chai.assert;

const moment = require('moment');

const chaiHttp = require('chai-http');

const dbInstance = require('../dbInstance');

const dbConnection = require('../db/dbEngines/mongodb');

const {
    INVOICES,
} = require('../db/collections');

const mockData = require('../data.json');


chai.use(chaiHttp);

suite('Functional Tests', function () {

    let app;

    const savedInvoices = [];

    let pendingCount = 0;
    let draftCount = 0;

    const purgeOldInvoice = (invoice) => {

        const {
            id, createdAt, paymentDue, total, ...purgedInvoice
        } = invoice;

        return purgedInvoice;
    };

    this.beforeAll(async () => {

        await dbConnection.connectDB();

        dbInstance.setDB(dbConnection);

        await dbConnection.deleteMany(INVOICES, {});

        app = require('../app');

    });

    this.afterAll(async () => {

        await dbConnection.deleteMany(INVOICES, {});

        process.exit(0);

    });

    suite('CREATING AN INVOICE', function () {

        test('0. Creating an Invoice - Should return newly created invoice in body as invoice key with all valid keys', async function () {

            const validInvoice = purgeOldInvoice(mockData[mockData.length - 1]);

            const response = await chai.request(app).post('/api/v1/invoice').send(validInvoice);

            assert.isObject(response, 'response from create invoice is an object');

            assert.strictEqual(response.status, 200, 'response status is 200');

            assert.isObject(response.body, 'response body is object');

            assert.strictEqual(response.body.error, false, 'response body has error to be false');

            assert.strictEqual(response.body.message, 'invoice created successfully', 'response body must have message as "invoice created successfully"');

            assert.hasAllKeys(response.body.invoice, mockData[0], 'response body has invoice object with valid keys');

            savedInvoices.push(response.body.invoice);

            response.body.invoice.status === 'pending' && pendingCount++;

            response.body.invoice.status === 'draft' && draftCount++;

        });

        test('1. Creating an Invoice - Should create a random, and valid ID', async function () {

            const validInvoice = purgeOldInvoice(mockData[mockData.length - 1]);

            const [{ id: savedInvoiceId }] = savedInvoices;

            const idRegex = /[A-Z]{2}[0-9]{4}/;

            const {
                body: {
                    invoice: {
                        id,
                        status,
                    },
                }
            } = await chai.request(app).post('/api/v1/invoice').send(validInvoice);

            assert.isOk(id, 'id must be created');

            assert.notEqual(id, savedInvoiceId, 'id must be random');

            assert.strictEqual(true, idRegex.test(id), 'id must be valid');

            status === 'pending' && pendingCount++;

            status === 'draft' && draftCount++;

        });

        test('2. Creating an Invoice - Should pass with status 200, if draft, with missing fields present/ or not', async function () {

            const validInvoice = purgeOldInvoice(mockData[mockData.length - 1]);

            const {
                status,
                body: {
                    invoice,
                }
            } = await chai.request(app).post('/api/v1/invoice').send(validInvoice);

            assert.isOk(status, 'status must be present');

            assert.strictEqual(status, 200, 'status must be 200');

            invoice.status === 'pending' && pendingCount++;

            invoice.status === 'draft' && draftCount++;

        });

        test('3. Creating an Invoice - Should fail with status 400, error true, if pending, with missing', async function () {

            const validInvoice = purgeOldInvoice(mockData[mockData.length - 2]);

            delete validInvoice.clientAddress;

            delete validInvoice.clientEmail;

            delete validInvoice.senderAddress.country;

            const {
                status,
                body: {
                    error,
                    message,
                }
            } = await chai.request(app).post('/api/v1/invoice').send(validInvoice);

            assert.isOk(status, 'status must be present');

            assert.strictEqual(status, 400, 'status must be 400');

            assert.strictEqual(error, true, 'error must be true');

            assert.strictEqual(message, 'missing fields', 'error must be true');

        });

        test('4. Creating an Invoice - Should have paymentDue property equal to createdAt plus paymentTerms', async function () {

            const validInvoice = purgeOldInvoice(mockData[mockData.length - 1]);

            const { paymentTerms } = validInvoice;

            const {
                body: {
                    invoice: {
                        createdAt,
                        paymentDue,
                        status,
                    },
                }
            } = await chai.request(app).post('/api/v1/invoice').send(validInvoice);

            assert.isOk(createdAt, 'createdAt must be present');

            assert.isOk(paymentDue, 'paymentDue must be present');

            assert.equal(paymentDue, moment(createdAt).add(paymentTerms, 'days').format('YYYY-MM-DD'), 'createdAt plus paymentTerms must equal paymentDue');

            status === 'pending' && pendingCount++;

            status === 'draft' && draftCount++;

        });

        test('5. Creating an Invoice - Should have invoice total equal to sum of all items total', async function () {

            const validInvoice = purgeOldInvoice(mockData[mockData.length - 1]);

            const validInvoiceTotal = validInvoice.items.reduce((acc, { total }) => {
                acc += total;
                return acc;
            }, 0);

            const {
                body: {
                    invoice: {
                        total,
                        status,
                    },
                }
            } = await chai.request(app).post('/api/v1/invoice').send(validInvoice);

            assert.isNumber(total, 'total must be a number');

            assert.equal(total, validInvoiceTotal, 'total must be equal to sum of all items');

            status === 'pending' && pendingCount++;

            status === 'draft' && draftCount++;

        });

    });

    suite('GETTING AN INVOICE/GETTING INVOICES', function () {

        test('0. Getting an invoice - Should return all invoices as invoices key in body, if no constraints is given (id, status), res status as 200, ', async function () {

            const {
                status,
                body: {
                    invoices,
                }
            } = await chai.request(app).get('/api/v1/invoice').query({});

            assert.equal(status, 200, 'status must equal 200');

            assert.isArray(invoices, 'invoices must be present and an array');

        });

        test('1. Getting an invoice - Should return matching single invoice object as invoice key, if valid id is given, res status as 200, ', async function () {

            const [{ id: savedInvoiceId }] = savedInvoices;

            const {
                status,
                body: {
                    invoice,
                }
            } = await chai.request(app).get('/api/v1/invoice').query({ id: savedInvoiceId });

            assert.deepEqual(status, 200, 'status must equal 200');

            assert.isObject(invoice, 'invoice must be present and an object');

            assert.deepEqual(invoice, savedInvoices[0], 'invoice must match created invoice');

        });

        test('2. Getting an invoice - Should return status code 404, with message "invoice not found", error as true, if invalid id is given', async function () {

            const id = 'A3333UUU'

            const {
                status,
                body: {
                    error,
                    message,
                }
            } = await chai.request(app).get('/api/v1/invoice').query({ id });

            assert.deepEqual(status, 404, 'status must equal 404');

            assert.equal(error, true, 'error must be true');

            assert.equal(message, "invoice not found", 'message must be "invoice not found"');

        });

        test('3. Getting an invoice - Should return all matching invoices as invoices key in body, if status is given and valid ["pending","draft", "paid"], with status code 200', async function () {

            const invoiceStatus = 'pending';

            const {
                status,
                body: {
                    invoices,
                }
            } = await chai.request(app).get('/api/v1/invoice').query({ status: invoiceStatus });

            assert.deepEqual(status, 200, 'status must equal 200');

            assert.equal(invoices.length, pendingCount, 'must return correct length of matching invoices');

        });

        test('4. Getting an invoice - Should return status as 400, error as true, message as "invalid status", if status is given and invalid', async function () {

            const invoiceStatus = 'unpending';

            const {
                status,
            } = await chai.request(app).get('/api/v1/invoice').query({ status: invoiceStatus });

            assert.deepEqual(status, 400, 'status must equal 400');

        });

    })

    suite('EDITING/MARKING AN INVOICE', function () {

        test('0. Editing/Marking an Invoice - Should return updated invoice in body with all valid keys (for testing)', async function () {

            savedInvoices[0].clientAddress = mockData[0].clientAddress;

            savedInvoices[0].clientEmail = mockData[0].clientEmail;

            savedInvoices[0].items.push(
                {
                    "name": "Logo Re-design",
                    "quantity": 1,
                    "price": 3102.04,
                    "total": 3102.04
                });

            const {
                status,
                body: {
                    invoice,
                }
            } = await chai.request(app).patch('/api/v1/invoice').query({ id: savedInvoices[0].id }).send({ invoice: savedInvoices[0] });


            assert.equal(status, 200, 'status must equal 200');


            assert.isObject(invoice, 'invoice must be present and an object');


            assert.hasAllKeys(invoice, savedInvoices[0], 'Should have response as valid invoice object with valid keys');

        });

        test('1.  Editing/Marking an Invoice - Should return status code 404, with message "invoice not found", error as true, if invalid id is given, ', async function () {

            const id = 'A3333UUU'

            const {
                status,
                body: {
                    error,
                    message,
                }
            } = await chai.request(app).patch('/api/v1/invoice').query({ id }).send({ invoice: savedInvoices[0] });

            assert.deepEqual(status, 404, 'status must equal 404');

            assert.equal(error, true, 'error must be true');

            assert.equal(message, "invoice not found", 'message must be "invoice not found"');

        });

        test('2.  Editing/Marking an Invoice - Should return status code 400, with message "missing fields", error as true, if invalid id is given (undefined), ', async function () {

            const id = undefined;

            const {
                status,
                body: {
                    error,
                    message,
                }
            } = await chai.request(app).patch('/api/v1/invoice').query({ id }).send({ invoice: savedInvoices[0] });

            assert.deepEqual(status, 400, 'status must equal 400');

            assert.equal(error, true, 'error must be true');

            assert.equal(message, "missing fields", 'message must be "missing fields"');

        });

        test('3. Editing/Marking an Invoice - Should have status as pending or paid after edit/mark', async function () {

            savedInvoices[0].items.push(
                {
                    "name": "New Logo",
                    "quantity": 1,
                    "price": 1532.33,
                    "total": 1532.33
                });

            const {
                body: {
                    invoice,
                }
            } = await chai.request(app).patch('/api/v1/invoice').query({ id: savedInvoices[0].id }).send({ invoice: savedInvoices[0] });

            assert.equal(true, ['pending', 'paid'].includes(invoice.status), 'status must be pending or paid after edit/mark');

        });

        test('4. Editing/Marking an Invoice - Should fail with missing fields, having status as 400, message as missing fields, error as true', async function () {

            savedInvoices[0].items.push(
                {
                    "name": "Brand Guidelines",
                    "quantity": 1,
                    "price": 2500.00,
                    "total": 2500.00
                });

            const clientName = savedInvoices[0].clientName;

            delete savedInvoices[0].clientName;

            const {
                status,
                body: {
                    error,
                    message,
                }
            } = await chai.request(app).patch('/api/v1/invoice').query({ id: savedInvoices[0].id }).send({ invoice: savedInvoices[0] });

            assert.equal(status, 400, 'status must be 400');

            assert.equal(message, 'missing fields', 'message must be "missing fields"');

            assert.equal(error, true, 'error must be true');

            savedInvoices[0].clientName = clientName;

            savedInvoices[0].items.pop();

        });

        test('5. Editing/Marking an Invoice - Should have edited property value equal to updated property value', async function () {

            savedInvoices[0].items.push(
                {
                    "name": "Brand Guidelines",
                    "quantity": 1,
                    "price": 2500.00,
                    "total": 2500.00
                });

            savedInvoices[0].paymentTerms = 10;

            const validInvoiceNewTotal = savedInvoices[0].items.reduce((acc, { total }) => {
                acc += total;
                return acc;
            }, 0);


            const {
                body: {
                    invoice: {
                        createdAt,
                        paymentTerms,
                        total,
                        paymentDue
                    },
                    message,
                }
            } = await chai.request(app).patch('/api/v1/invoice').query({ id: savedInvoices[0].id }).send({ invoice: savedInvoices[0] });

            assert.equal(message, "invoice updated successfully", 'message must be "invoice updated successfully"');

            assert.equal(total, validInvoiceNewTotal, 'invoice must be updated');

            assert.equal(paymentDue, moment(createdAt).add(paymentTerms, 'days').format('YYYY-MM-DD'), 'createdAt plus paymentTerms must equal paymentDue');

        });

        test('6. Editing/Marking an Invoice - Should have edited property value equal to updated property value (marking as paid)', async function () {

            const {
                body: {
                    invoice,
                }
            } = await chai.request(app).patch('/api/v1/invoice').query({ id: savedInvoices[0].id, markAsPaid: true }).send({ invoice: savedInvoices[0] });

            assert.equal(invoice.status, 'paid', 'invoice must be updated (marked as paid)');

        });

    });

    suite('DELETING AN INVOICE', function () {

        test('0. Deleting an Invoice - Should return status code 404, with message "invoice not found", error as true, if invalid id is given, ', async function () {

            const id = 'QQQ333';

            const {
                status,
                body: {
                    error,
                    message,
                }
            } = await chai.request(app).delete('/api/v1/invoice').query({ id });


            assert.equal(status, 404, 'status must equal 404');


            assert.equal(true, error, 'error must be true');


            assert.equal(message, 'invoice not found', 'message must be "invoice not found"');

        });

        test('1. Deleting an Invoice - Should return status code 400, with message "missing fields", error as true, if invalid id (undefined) is given, ', async function () {

            const id = undefined;

            const {
                status,
                body: {
                    error,
                    message,
                }
            } = await chai.request(app).delete('/api/v1/invoice').query({ id });


            assert.equal(status, 400, 'status must equal 400');


            assert.equal(true, error, 'error must be true');


            assert.equal(message, 'missing fields', 'message must be "missing fields"');

        });
        
        test('2. Deleting an Invoice - Should return status code as 200, message "invoice deleted successfully", error false, invoice returned, and absent from db, if valid id is given, ', async function () {

            const [{ id }] = savedInvoices;

            const {
                status,
                body: {
                    invoice,
                    message,
                    error,
                }
            } = await chai.request(app).delete('/api/v1/invoice').query({ id });

            assert.deepEqual(status, 200, 'status must equal 200');

            assert.equal(error, false, 'error must be false');

            assert.equal(message, "invoice deleted successfully", 'message must be "invoice deleted successfully"');

            assert.hasAllKeys(invoice, savedInvoices[0], 'response must have valid invoice object with valid keys');

            const {
                status: status2,
                body: {
                    error: error2,
                    message: message2,
                }
            } = await chai.request(app).get('/api/v1/invoice').query({ id });

            assert.deepEqual(status2, 404, 'status must equal 404');

            assert.equal(error2, true, 'error must be true');

            assert.equal(message2, "invoice not found", 'message must be "invoice not found"');

        });

    })

});




