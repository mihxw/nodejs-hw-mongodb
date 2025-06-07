// import mongoose from 'mongoose';
import ContactCollection from '../db/models/contact.js';
import { calcPaginationData } from '../utils/calcPaginationData.js';
import { typeList } from '../constants/contacts.js';

export const getContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  query = {},
}) => {
  console.log('Final query before passing:', query);

  const filter = {};

  console.log('MongoDB query before filter processing:', query);

  if (query.userId) {
    filter.userId = query.userId;
  }

  if (query.contactType && typeList.includes(query.contactType)) {
    filter.contactType = query.contactType;
  }

  if (query.isFavourite !== undefined) {
    filter.isFavourite = query.isFavourite;
  }
  console.log('Final MongoDB Query Filter before search:', query);
  console.log('Final MongoDB Query Filter:', filter);

  const skip = (page - 1) * perPage;
  const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  console.log('Final MongoDB Sort Options:', sortOptions);

  const totalItems = await ContactCollection.countDocuments(filter);

  console.log('MongoDB Filter Applied:', filter);
  console.log('Filter passed to MongoDB:', filter);
  console.log('Final MongoDB Query Filter before search:', filter);
  console.log('Filter before applying to MongoDB:', filter);
  console.log('Final Filter before MongoDB query:', filter);
  console.log('Filter before MongoDB query:', filter);

  console.log('Final Filter before MongoDB query:', filter);

  const data = await ContactCollection.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(perPage);

  const paginationData = calcPaginationData({ page, perPage, totalItems });

  return {
    data,
    totalItems,
    ...paginationData,
  };
};

export const getContact = (contactId, userId) => {
  return ContactCollection.findOne({ _id: contactId, userId });
};

export const addContact = (payload) => {
  return ContactCollection.create(payload);
};

export const upsertContact = async (
  contactId,
  userId,
  payload,
  option = {},
) => {
  const { upsert } = option;
  const updatedContact = await ContactCollection.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    { new: true, upsert },
  );

  if (!updatedContact) return null;

  return {
    data: updatedContact,
    isNew: upsert && !updatedContact._id.equals(contactId),
  };
};

export const updateContactById = async (contactId, userId, payload) => {
  return ContactCollection.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    { new: true },
  );
};

export const deleteContactById = async (contactId, userId) =>
  ContactCollection.findOneAndDelete({ _id: contactId, userId });