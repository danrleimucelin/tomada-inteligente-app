import * as SQLite from 'expo-sqlite'

const db = SQLite.openDatabase('tomada_inteligente.db');

export default db;