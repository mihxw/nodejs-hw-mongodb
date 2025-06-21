import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';

const bootstrap = async () => {
  try {
    await initMongoConnection(); // Чекаємо підключення до MongoDB
    await setupServer(); // Запускаємо сервер лише після успішного з'єднання
  } catch (err) {
    console.error('❌ Failed to start app:', err.message);
    process.exit(1);
  }
};

bootstrap();
