import cloudinary from 'cloudinary';
import { getEnvVar } from './getEnvVar.js';

cloudinary.v2.config({
  cloud_name: getEnvVar('CLOUD_NAME'),
  api_key: getEnvVar('CLOUD_API_KEY'),
  api_secret: getEnvVar('CLOUD_API_SECRET'),
});

export function uploadCloudinary(filePath) {
  return cloudinary.v2.uploader.upload(filePath);
}