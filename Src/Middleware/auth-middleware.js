import jwt from 'jsonwebtoken';
import { RetornarErro } from '../Utils/utils.js';

export const Role = {
  USER: 'USER',
  ADMIN: 'ADMIN',
};

export function AuthMiddleware(...allowedRoles) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return RetornarErro(res, 'Token não fornecido', 401);

   let token = authHeader;

if (authHeader.startsWith('Bearer ')) {
  token = authHeader.slice('Bearer '.length).trim();
}


    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) return RetornarErro(res, 'Erro de configuração', 500);

      const decoded = jwt.verify(token, secret);
      req.user = decoded; 


      const hasPermission = decoded.role?.some((r) => allowedRoles.includes(r));
      if (!hasPermission) return RetornarErro(res, 'Acesso negado', 401);

      next();
    } catch {
      return RetornarErro(res, 'Token inválido', 401);
    }
  };
}
