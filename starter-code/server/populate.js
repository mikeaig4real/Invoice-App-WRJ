require('dotenv').config();

const {
  INVOICES,
} = require('./db/collections');

const dbInstance = require('./dbInstance');

const Invoices = require('./data.json');

const populate = async (DB_TYPE, COLLECTION, DATA) => {

  try {

    const dbEngine = await require('./db/dbEngines')(DB_TYPE);

    await dbEngine.connectDB().then((DB) => console.log(`CONNECTED TO DATABASE: ${DB} - ${DB_TYPE.toUpperCase()}`));

    dbInstance.setDB(dbEngine);

    const {
      insertMany
    } = dbInstance.getDB();

    console.log(`Populating ${COLLECTION}....!!!`);

    await insertMany(COLLECTION, DATA);

    console.log('Success!!!');

    process.exit(0);

  } catch (error) {

    console.log(error);

    process.exit(1);

  }
}

populate('mongodb', INVOICES, Invoices);
