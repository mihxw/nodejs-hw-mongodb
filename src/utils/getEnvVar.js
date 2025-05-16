import "dotenv/config";
// // Щоб зчитувати та використовувати змінні оточення в додатку, потрібно буде встановити пакет dotenv 

import dotenv from 'dotenv';
dotenv.config();

export function getEnvVar(name, defaultValue) {
  const value = process.env[name];
  if (value) return value;
  if (defaultValue) return defaultValue;
  throw new Error(`Missing: process.env[${name}]`);
}