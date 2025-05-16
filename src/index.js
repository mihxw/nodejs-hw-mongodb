// Імпортуйте і викличте у ньому функцію setupServer.
// src/index.
import dotenv from 'dotenv';
import "dotenv/config";
import { initMongoConnection } from "./db/initMongoConnection.js"
import { setupServer } from "./server.js"

const bootstrap = async() => {
    await initMongoConnection();
    setupServer();
}
bootstrap();

// У файлі src/index.js викличте функції initMongoConnection. Переконайтеся, що зʼєднання із базою встановлюється до запуску серверу.