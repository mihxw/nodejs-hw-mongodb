import mongoose from 'mongoose';
import { getEnvVar } from '../utils/getEnvVar.js';

export const initMongoConnection = async () => {
  const user = getEnvVar('MONGODB_USER');
  const pwd = getEnvVar('MONGODB_PASSWORD');
  const url = getEnvVar('MONGODB_URL');
  const db = getEnvVar('MONGODB_DB');

  const uri = `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`;
  console.log('🔌 Connecting to:', uri);

  try {
    await mongoose.connect(uri);
    console.log('✅ Mongo connected!');
  } catch (err) {
    console.error('❌ Connection failed:', err);
    process.exit(1);
  }
};