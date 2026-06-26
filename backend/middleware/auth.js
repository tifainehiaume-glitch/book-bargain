/* vérifie le token JWT */
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token      = authHeader && authHeader.split(' ')[1];

    /* Si pas de token → non connecté */
    if (!token) {
        return res.status(401).json({ message: 'Accès refusé. Connectez-vous.' });
    }

    /* Vérifier et décoder le token */
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next(); 

    } catch (error) {
        return res.status(403).json({ message: 'Token invalide ou expiré.' });
    }
};

module.exports = auth;