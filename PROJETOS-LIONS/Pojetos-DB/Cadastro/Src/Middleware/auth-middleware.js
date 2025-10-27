import { RetornarErro } from '../Utils/utils.js';
import jwt from 'jsonwebtoken';

export function AuthMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return RetornarErro(res, "Token invalido", 401);
    
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return RetornarErro(res, "Erro de configuração", 500);
        }
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (error) {
        return RetornarErro(res, "Token invalido", 401);
    }
}
