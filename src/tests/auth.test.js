const jwt = require('jsonwebtoken');
const verificarToken = require('../middleware/auth');

test('verificarToken debería fallar sin token', () => {
    const req = { headers: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    verificarToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
});