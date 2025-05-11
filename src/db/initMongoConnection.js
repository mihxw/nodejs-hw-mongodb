import mongoose from 'mongoose';

import { getEnvVar } from '../utils/getEnvVar.js';

export const initMongoConnection = async () => {
    
        const user = getEnvVar('MONGODB_USER');
        const pwd = getEnvVar('MONGODB_PASSWORD');
        const url = getEnvVar('MONGODB_URL');
        const db = getEnvVar('MONGODB_DB');
// в посиланні вище її нема, але ми можемо вказати конкретну БД, яку будемо використовувати.
        // Вона вказується після MONGODB_URL між "/" і "?"
        try {
        await mongoose.connect(
            `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority&appName=Cluster0`,
        );
        console.log('Mongo connection successfully established!');

    } catch (e) {
        console.log('Error while setting up mongo connection', e);
        throw e;
    }
};