import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
    { name: 'cryptoDB.db', location: 'default' },
    () => console.log("Database connected"),
    error => console.log("Database connection error:", error)
);

const createTable = () => {
    db.transaction(tx => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS Crypto (
                id TEXT PRIMARY KEY, 
                name TEXT, 
                price REAL, 
                image TEXT, 
                change REAL
            );`,
            [],
            () => console.log("Table created successfully"),
            error => console.log("Error creating table:", error)
        );
    });
};

const saveToLocalDB = (coins) => {
    db.transaction(tx => {
        coins.forEach(coin => {
            tx.executeSql(
                `INSERT OR REPLACE INTO Crypto (id, name, price, image, change) 
                 VALUES (?, ?, ?, ?, ?);`,
                [coin.id, coin.name, coin.current_price, coin.image, coin.price_change_percentage_24h],
                () => console.log(`Saved ${coin.name} to local DB`),
                error => console.log("Error saving to DB:", error)
            );
        });
    });
};

const getFromLocalDB = (callback) => {
    db.transaction(tx => {
        tx.executeSql(
            "SELECT * FROM Crypto;",
            [],
            (_, { rows }) => callback(rows.raw()),
            error => console.log("Error fetching from DB:", error)
        );
    });
};

export { createTable, db, saveToLocalDB, getFromLocalDB };
