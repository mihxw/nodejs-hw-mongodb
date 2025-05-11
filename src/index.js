import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';
 
//фунція bootstrap-фуекція запуску застосунку, яка буде ініціалізувати підключення до бази даних, після чого запускати сервер.
const bootstrap = async () => {
    try {
        await initMongoConnection();
        await setupServer();
    } catch (e) {
        console.error('Error during app bootstrap:', e.message);
    process.exit(1); // Виходимо з процесу з кодом помилки
  }
};
bootstrap();