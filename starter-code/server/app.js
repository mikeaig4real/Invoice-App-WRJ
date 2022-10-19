require('dotenv').config();

require('express-async-errors');

const cors = require('cors');

const morgan = require('morgan');

const express = require('express');

const app = express();

const invoiceRoutes = require('./routes/invoiceRoutes');

const notFoundMiddleware = require('./middleware/not-found');

if (process.env.NODE_ENV !== 'production') {

    app.use(morgan('dev'));

};

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.get('/', async (req, res) => {
    res.send('Invoice App');
});

app.use('/api/v1/invoice', invoiceRoutes);

app.use(notFoundMiddleware);

module.exports = app;
