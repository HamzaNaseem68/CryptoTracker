import SQLite from 'react-native-sqlite-storage';

// Initialize Database Connection
const db = SQLite.openDatabase(
    { name: 'cryptoDB.db', location: 'default' },
    () => {
        console.log("Database connected");
        createTable(); // Call after DB is ready
    },
    error => console.log("Database connection error:", error)
);

// Function to Create Table (Ensuring it's not duplicated)
const createTable = () => {
    console.log("Attempting to create table...");
    db.transaction(tx => {
        tx.executeSql(
            "CREATE TABLE IF NOT EXISTS Crypto (id TEXT PRIMARY KEY, name TEXT, price REAL, image TEXT, change REAL);",
            [],
            () => console.log("Table created successfully"),
            (error) => console.log("Error creating table", error)
        );
    });
};

// Export functions properly
export { createTable, db };

export const saveToLocalDB = (coins) => {
    db.transaction(tx => {
        coins.forEach(coin => {
            tx.executeSql(
                "INSERT OR REPLACE INTO Crypto (id, name, price, image, change) VALUES (?, ?, ?, ?, ?);",
                [coin.id, coin.name, coin.current_price, coin.image, coin.price_change_percentage_24h]
            );
        });
    });
};

export const getFromLocalDB = (callback) => {
    db.transaction(tx => {
        tx.executeSql("SELECT * FROM Crypto;", [], (_, { rows }) => {
            callback(rows.raw());
        });
    });
};
