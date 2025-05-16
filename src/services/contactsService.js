import Contact from "../models/contacts.js";

export const getContacts = async () => {
  try {
    const contacts = await Contact.find();
    return contacts;
  } catch (error) {
    throw new Error("Failed to get contacts: " + error.message);
  }
};

export const getContactsById = async (id) => {
  try {
    const contact = await Contact.findById(id);
    return contact;
  } catch (error) {
    throw new Error("Failed to get contact by ID: " + error.message);
  }
};