import createHttpError from 'http-errors';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getEnvWar } from '../utils/getEnv.js';

import {
  getAllContact,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

const createNewContact = async (req, res) => {
  const contactData = {
    ...req.body,
    userId: req.user._id,
  };
  if (req.file) {
    contactData.photo = await saveFileToCloudinary(req.file);
  }
  const newContact = await createContact(contactData);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

const getAll = async (req, res) => {
  const userId = req.user._id;
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const contacts = await getAllContact(
    page,
    perPage,
    sortBy,
    sortOrder,
    userId,
  );

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};
const getById = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const contact = await getContactById(contactId, userId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};
const PatchupdateContact = async (req, res, next) => {
  const { contactId } = req.params;
  let photo = '';
  if (req.file) {
    photo = await saveFileToCloudinary(req.file);
  }
  const userId = req.user._id;

  const result = await updateContact(contactId, req.body, userId, photo);

  if (!result) {
    throw createHttpError.NotFound('Contact not found 11');
  }

  const status = result.isNew ? 201 : 200;
  res.status(status).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.contact,
  });
};
const deleteContactContr = async (req, res, next) => {
  const { contactId } = req.params;

  const userId = req.user._id;

  const contactByDelete = await deleteContact(contactId, userId);

  if (!contactByDelete) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};
const pathContactController = async (req, res, next) => {
  const { studentId } = req.params;
  const photo = req.file;
  let photoUrl;

  if (photo) {
    if (getEnvWar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }
  const result = await updateContact(contactId, {
    ...req.body,
    photo: photoUrl,
  });
  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.contact,
  });
};

export default {
  createNewContact,
  getAll,
  getById,
  PatchupdateContact,
  deleteContactContr,
  pathContactController,
};