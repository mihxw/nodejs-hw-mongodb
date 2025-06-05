import express from 'express';
import contacts from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactsSchema,
  updateContactsSchema,
} from '../validation/contacts.js';
const router = express.Router();

router.post(
  '/',
  validateBody(createContactsSchema),
  ctrlWrapper(contacts.createNewContact),
);

router.get('/', ctrlWrapper(contacts.getAll));

router.get('/:contactId', isValidId, ctrlWrapper(contacts.getById));

router.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactsSchema),
  ctrlWrapper(contacts.PatchupdateContact),
);
router.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(contacts.deleteContactContr),
);
export default router;