const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    const authorization = req.headers.authorization;

    if (!authorization || !/^Bearer\s+\S+$/i.test(authorization)) {
        return res.status(401).json({
            erro: 'Token de autenticação não informado.'
        });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret || secret.length < 32) {
        console.error('JWT_SECRET não configurado corretamente.');

        return res.status(500).json({
            erro: 'Erro interno de autenticação.'
        });
    }

    const token = authorization.replace(/^Bearer\s+/i, '');

    try {
        const payload = jwt.verify(token, secret, {
            algorithms: ['HS256']
        });

        if (
            !payload.sub ||
            !['ADMIN', 'ATENDENTE', 'CLIENTE'].includes(payload.perfil)
        ) {
            return res.status(401).json({
                erro: 'Token com informações inválidas.'
            });
        }

        req.usuario = {
            id: String(payload.sub),
            perfil: payload.perfil
        };

        return next();
    } catch (error) {
        return res.status(401).json({
            erro: 'Token inválido ou expirado.'
        });
    }
}

module.exports = authMiddleware;