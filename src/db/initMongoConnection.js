import mongoose from 'mongoose';
import { getEnvVar } from '../utils/getEnvVar.js';

export const initMongoConnection = async () => {
    const mongoUri = getEnvVar('MONGODB_URL');

    try {
        await mongoose.connect(mongoUri);
        console.log('Mongo connection successfully established!');
    } catch (e) {
        console.log('Error while setting up mongo connection', e);
        throw e;
    }
};