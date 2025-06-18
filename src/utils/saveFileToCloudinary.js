import cloudinary from 'cloudinary';
import fs from 'node:fs/promises';
import dotenv from 'dotenv';
dotenv.config();
import { getEnvWar } from './getEnv.js';
import { CLOUDINARY } from '../constants/constants.js';

const cloud_name = getEnvWar(CLOUDINARY.CLOUD_NAME);
const api_key = getEnvWar(CLOUDINARY.API_KEY);
const api_secret = getEnvWar(CLOUDINARY.API_SECRET);

cloudinary.v2.config({
  secure: true,
  cloud_name,
  api_key,
  api_secret,
});

export const saveFileToCloudinary = async (file) => {
  const response = await cloudinary.v2.uploader.upload(file.path);
  await fs.unlink(file.path);
  return response.secure_url;
};