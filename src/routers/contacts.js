import express from 'express';
import {
  getAllContactsController,
  getContactByIdController
} from '../controllers/contacts.js'; // Імпортуємо функції контролерів

const router = express.Router();

// Отримати всі контакти
router.get('/', getAllContactsController);

// Отримати контакт по id
router.get('/:id', getContactByIdController);

export default router;