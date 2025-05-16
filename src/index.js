import express from 'express';
import contactsRouter from './routers/contacts.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Вбудований middleware для роботи з JSON
app.use(express.json());

// Всі маршрути для контактів
app.use('/api/contacts', contactsRouter);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`✅ Сервер працює на http://localhost:${PORT}`);
});