import { Request } from 'express';
import { decryptValue } from './crypto';

export const setAuth = (req: Request, tokenName: string, key: string) => {
  const token = req.cookies[tokenName];

  if (token) {
    req.headers.authorization = `Bearer ${decryptValue(token, key)}`;
  }

  return req;
};
