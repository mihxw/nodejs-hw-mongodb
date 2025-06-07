import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getContactsController,
  getContactsByIdController,
  addContactsController,
  upsertContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';
import { validateBody } from '../utils/validateBody.js';
import {
  addValidateContacts,
  updateValidateContacts,
} from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';

const contactRouter = Router();

contactRouter.use(authenticate);

contactRouter.get('/', ctrlWrapper(getContactsController));

contactRouter.get(
  '/:contactId',
  isValidId,
  ctrlWrapper(getContactsByIdController),
);

contactRouter.post(
  '/',
  validateBody(addValidateContacts),
  ctrlWrapper(addContactsController),
);

contactRouter.put(
  '/:contactId',
  isValidId,
  validateBody(updateValidateContacts),
  ctrlWrapper(upsertContactController),
);

contactRouter.patch(
  '/:contactId',
  isValidId,
  validateBody(updateValidateContacts),
  ctrlWrapper(updateContactController),
);

contactRouter.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(deleteContactController),
);

export default contactRouter;