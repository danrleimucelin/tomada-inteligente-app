import db from "./SQLiteDatabase";

db.transaction(tx => {
    // tx.executeSql("DROP TABLE user");

    tx.executeSql("CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(80), email VARCHAR(255), access_token VARCHAR(255));");
});

const create = (user) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `INSERT INTO user (id, name, email, access_token) VALUES (?, ?, ?, ?)`,
                [
                    user.id,
                    user.name,
                    user.email,
                    user.access_token
                ],
                (_, {rowsAffected, insertId}) => {
                    if (rowsAffected > 0) {
                        resolve(insertId);
                    } else {
                        reject('Error inserting obj: ' + JSON.stringify(user));
                    }
                },
                (_, error) => {
                    reject(error)
                }
            );
        });
    });
}

const first = () => {
    return new Promise ((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                "SELECT * FROM user LIMIT 1",
                [],
                (_, { rows }) => {
                    resolve(rows._array[0]);
                },
                (_, error) => {
                    reject(error)
                }
            );
        });
    });
}

const removeAll = () => {
    return new Promise ((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                "DELETE FROM user;",
                [],
                (_, { rowsAffected }) => {
                    resolve(rowsAffected);
                },
                (_, error) => {
                    reject(error)
                }
            );
        });
    });
}

export default {
    create,
    first,
    removeAll,
}