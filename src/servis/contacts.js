import { ContactsColection } from '../models/contacts.js';

export const getAllContacts = async () => {
  const contacts = await ContactsColection.find();
  return contacts;
};

export const getContactById = async (contactId) => {
  const contact = await ContactsColection.findById(contactId);
  return contact;
};