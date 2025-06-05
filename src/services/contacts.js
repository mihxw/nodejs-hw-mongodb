import mongoose from 'mongoose';

import { contactCollection } from '../db/models/contacts.js';

export const getAllContact = async (page, perPage, sortBy, sortOrder) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;
  const [total, contacts] = await Promise.all([
    contactCollection.countDocuments(),
    contactCollection
      .find()
      .sort([[sortBy, sortOrder]])
      .skip(skip)
      .limit(perPage),
  ]);
  const totalPages = Math.ceil(total / perPage);

  return {
    data: contacts,
    page,
    perPage,
    totalItems: total,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: totalPages > page,
  };
};

export const getContactById = (contactId) => {
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return null;
  }
  return contactCollection.findOne({ _id: contactId });
};

export const createContact = async (payload) => {
  const contact = await contactCollection.create(payload);
  return contact;
};
export const updateContact = async (contactId, payload, options) => {
  const rawResult = await contactCollection.findOneAndUpdate(
    { _id: contactId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );
  if (!rawResult || !rawResult.value) return null;
  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};
export const deleteContact = async (contactId) => {
  const contactForDelete = await contactCollection.findOneAndDelete({
    _id: contactId,
  });
  return contactForDelete;
};