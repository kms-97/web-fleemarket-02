import { AES, enc } from 'crypto-js';

export const encryptValue = (value: string, key: string) => {
  return AES.encrypt(value, key).toString();
};

export const decryptValue = (value: string, key: string) =>
  AES.decrypt(value, key).toString(enc.Utf8);
