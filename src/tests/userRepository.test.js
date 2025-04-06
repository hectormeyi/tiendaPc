const UserRepository = require('../repositories/userRepository');
const db = require('../config/db');
const bcrypt = require('bcrypt');

// Mock de la base de datos
jest.mock('../config/db', () => ({
    query: jest.fn()
}));

describe('UserRepository', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('debería crear un usuario con contraseña hasheada', async () => {
        const email = 'test@test.com';
        const password = '123456';
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query.mockResolvedValue([{ insertId: 1 }]);

        const userId = await UserRepository.createUser(email, password);
        expect(db.query).toHaveBeenCalledWith(
            'INSERT INTO usuarios (email, password) VALUES (?, ?)',
            [email, expect.stringMatching(/^\$2[ayb]\$.{56}$/)] // Regex para hash bcrypt
        );
        expect(userId).toBe(1);
    });

    it('debería encontrar un usuario por email', async () => {
        const email = 'test@test.com';
        const mockUser = { id: 1, email, password: 'hashed' };
        db.query.mockResolvedValue([[mockUser]]);

        const user = await UserRepository.findUserByEmail(email);
        expect(db.query).toHaveBeenCalledWith('SELECT * FROM usuarios WHERE email = ?', [email]);
        expect(user).toEqual(mockUser);
    });
});