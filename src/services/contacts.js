import mongoose from 'mongoose';

import { contactCollection } from '../db/models/contacts.js';

export const getAllContact = async (
  page,
  perPage,
  sortBy,
  sortOrder,
  userId,
) => {
  const filter = { userId };

  const skip = page > 0 ? (page - 1) * perPage : 0;
  const [total, contacts] = await Promise.all([
    contactCollection.countDocuments(filter),
    contactCollection
      .find(filter)
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

export const getContactById = (contactId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return null;
  }
  return contactCollection.findOne({ _id: contactId, userId });
};

export const createContact = async (payload) => {
  const contact = await contactCollection.create(payload);
  return contact;
};
export const updateContact = async (contactId, payload, userId, photo) => {
  const updateContact = await contactCollection.findOneAndUpdate(
    { _id: contactId, userId },
    { ...payload, photo },
    {
      new: true,
    },
  );
  if (!updateContact) return null;
  return {
    contact: updateContact,
    isNew: false,
  };
};
export const deleteContact = async (contactId, userId) => {
  const contactForDelete = await contactCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });
  return contactForDelete;
};