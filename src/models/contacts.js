import Contact from "../models/contacts.js";

export const getContacts = () => Contact.find();

export const getContactsById = async (id) => {
  const contact = await Contact.findById(id);
  return contact;
};
