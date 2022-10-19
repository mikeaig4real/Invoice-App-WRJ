require('dotenv').config();

const MONGO_CLIENT = require('mongodb').MongoClient;

const {
  DB_NAME,
  MONGO_URL,
} = process.env;


const DB_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};



let DB_CLIENT;

const connectDB = async () => {

  try {

    if (!DB_CLIENT) {
      
      const MONGO_CONNECTION = await MONGO_CLIENT.connect(MONGO_URL, DB_OPTIONS);

      
      DB_CLIENT = await MONGO_CONNECTION.db(DB_NAME);
      

      return DB_NAME;

    }

  } catch (error) {
    
    throw new Error(error);

  };
};


const aggregateData = async (collections, object) => {

  try {

    const result = await DB_CLIENT.collection(collections).aggregate(object).toArray();

    return ({ result });

  } catch (error) {

    throw new Error(error);

  }
};

const updateMany = async (collections, query, update, options) => {
  
  try {

    const result = await DB_CLIENT.collection(collections).updateMany(query, update, options);

    return ({ result });

  } catch (error) {

    throw new Error(error);

  }
};

const findAndUpdateData = async (collections, query, update, options) => {

  try {

    const result = await DB_CLIENT.collection(collections).findOneAndUpdate(query, update, options);

    return ({ result });

  } catch (error) {

    throw new Error(error);

  }
}; 


const findAndDeleteData = async (collections, query, options) => {

  try {

    const result = await DB_CLIENT.collection(collections).findOneAndDelete(query, options);

    return ({ result });

  } catch (error) {

    throw new Error(error);

  }
}; 


const deleteMany = async (collections, query, options) => {
  
  try {

    const result = await DB_CLIENT.collection(collections).deleteMany(query, options);
    
    return ({ result });

  } catch (error) {

    throw new Error(error);

  }
};

const insertMany = async (collections, array) => {
  
  try {

    const result = await DB_CLIENT.collection(collections).insertMany(array);

    
    return ({ result });

  } catch (error) {

    throw new Error(error);

  }
};


module.exports = {
  connectDB,
  aggregateData,
  insertMany,
  updateMany,
  deleteMany,
  findAndUpdateData,
  findAndDeleteData,
};



