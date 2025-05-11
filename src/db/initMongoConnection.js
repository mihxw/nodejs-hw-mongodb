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
            //mongodb+srv://dianazinevych02:<db_password>@cluster0.amo7ris.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
            `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority&appName=Cluster0`,
        );
        //як аргумент передамо рядок з посиланням для підключення (connection string). 
        // Для формування цього посилання ми використаємо утилітарну функцію env, яка забезпечує доступ до змінних оточення.
        console.log('Mongo connection successfully established!');

    } catch (e) {
        console.log('Error while setting up mongo connection', e);
        throw e;
    }
};