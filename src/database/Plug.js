import db from "./SQLiteDatabase";

db.transaction(tx => {
    // tx.executeSql("DROP TABLE user");

    tx.executeSql("" +
        "CREATE TABLE IF NOT EXISTS plugs (" +
            "id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "name VARCHAR(80)" +
        ");");
});

const create = (plug) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `INSERT INTO plugs (id, name) VALUES (?, ?)`,
                [
                    plug.id,
                    plug.name
                ],
                (_, {rowsAffected, insertId}) => {
                    if (rowsAffected > 0) {
                        resolve(insertId);
                    } else {
                        reject('Error inserting obj: ' + JSON.stringify(plug));
                    }
                },
                (_, error) => {
                    reject(error)
                }
            );
        });
    });
}

const find = (id) => {
    return new Promise ((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                "SELECT * FROM plugs WHERE id = ?;",
                [id],
                (_, { rows }) => {
                    if (rows.length > 0) {
                        resolve(rows._array[0]);
                    } else {
                        reject("Obj not found: id = " + id);
                    }
                },
                (_, error) => {
                    reject(error)
                }
            );
        });
    });
}

const all = () => {
    return new Promise ((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                "SELECT * FROM plugs",
                [],
                (_, { rows }) => {
                    resolve(rows._array);
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
                "DELETE FROM plugs;",
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
    find,
    all,
    removeAll,
}