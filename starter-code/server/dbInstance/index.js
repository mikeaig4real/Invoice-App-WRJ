class DBInstance {
    constructor() {
        this.db = null;
    };

    setDB(engine) {
        this.db = engine;
    };

    getDB() {
        return this.db;
    }
};

module.exports = new DBInstance();