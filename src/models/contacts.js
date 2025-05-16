import ContactCollection from "../db/models/Contact.js";

export const getContacts = () => ContactCollection.find();
// export const getContactsById = () => ContactCollection.findOne({_id:id})

export const getContactsById = async (id) => {
  const contact = await ContactCollection.findById(id);
  return contact;
};