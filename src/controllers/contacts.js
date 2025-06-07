import {
  getContacts,
  getContact,
  addContact,
  upsertContact,
  deleteContactById,
  updateContactById,
} from '../services/contacts.js';

import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { isValidObjectId } from 'mongoose';

export const getContactsController = async (req, res) => {
  const paginationParams = parsePaginationParams(req.query);
  const sortParams = parseSortParams(req.query);

  console.log('Sorting Params:', sortParams);

  const filters = parseFilterParams(req.query);
  filters.userId = req.user._id; 

  console.log('Parsed filters:', filters);

  const { _id: userId } = req.user;
  const query = { userId };
  if (filters.type) query.contactType = filters.type;
  if (filters.isFavourite !== undefined)
    query.isFavourite = filters.isFavourite;

  console.log('MongoDB query filter before passing:', query);

  const data = await getContacts({
    ...paginationParams,
    ...sortParams,
    query,
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts',
    data,
  });
};

export const getContactsByIdController = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;
  console.log(userId);

  const cleanId = contactId.trim();

  if (!isValidObjectId(cleanId)) {
    throw createHttpError(400, 'Invalid contact ID');
  }

  const data = await getContact(cleanId, userId);
  if (!data) {
    throw createHttpError(404, `Contact with ID ${cleanId} not found`);
  }

  res.json({
    status: 200,
    message: `Successfully found contact with ID ${cleanId}!`,
    data,
  });
};

export const addContactsController = async (req, res) => {
  const { _id: userId } = req.user;
  const { email, contactType, ...rest } = req.body;

  if (!contactType) {
    throw createHttpError(400, 'contactType is required');
  }

  const data = await addContact({ email: email || null, contactType, ...rest, userId });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data,
  });
};

export const upsertContactController = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;

  let isNew = false;
  let data;

  if (contactId) {
    const payload = { ...req.body, userId };
    const result = await upsertContact(contactId, payload, {
      upsert: true,
    });
    data = result.data;
    isNew = result.isNew;
  } else {
    data = await addContact({ ...req.body, userId });
    isNew = true;
  }

  const status = isNew ? 201 : 200;
  const message = isNew
    ? 'Successfully created a contact!'
    : 'Successfully updated a contact!';
  res.status(status).json({
    status,
    message,
    data,
  });
};

export const updateContactController = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;
  const cleanId = contactId.trim();

  if (!req.body || Object.keys(req.body).length === 0) {
    throw createHttpError(400, 'Request body cannot be empty');
  }

  if (!isValidObjectId(cleanId)) {
    throw createHttpError(400, 'Invalid contact ID');
  }

  const updatedContact = await updateContactById(cleanId, { ...req.body, userId });

  if (!updatedContact || updatedContact.userId.toString() !== userId.toString()) {
    throw createHttpError(404, `Contact with ID ${cleanId} not found`);
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully updated contact!',
    data: updatedContact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;
  const cleanId = contactId.trim();

  if (!isValidObjectId(cleanId)) {
    throw createHttpError(400, 'Invalid contact ID');
  }

  const deletedContact = await deleteContactById(cleanId, userId);

  if (!deletedContact) {
    throw createHttpError(404, `Contact with ID ${cleanId} not found`);
  }

  // const contact = await getContact(cleanId);
  // if (!contact || contact.userId.toString() !== userId.toString()) {
  //   throw createHttpError(404, `Contact with ID ${cleanId} not found`);
  // }

  // await deleteContactById(cleanId);

  // const data = await deleteContactById(cleanId, userId);
  // // Check if the contact was found and deleted

  // if (!data) {
  //   throw createHttpError(404, `Contact with ID ${cleanId} not found`);
  // }

  res.status(204).send();
};