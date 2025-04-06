const db = require('../config/db');
const bcrypt = require('bcrypt');

class UserRepository {
    async createUser(email, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query('INSERT INTO usuarios (email, password) VALUES (?, ?)', [email, hashedPassword]);
        return result.insertId;
    }

    async findUserByEmail(email) {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        return rows[0];
    }
}

module.exports = new UserRepository();