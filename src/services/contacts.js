import { ContactsCollection } from "../models/contacts.js";

export const getAllContacts = async () => {
    const contacts = await ContactsCollection.find();
    return contacts;
};
export const getContactById = async (contactId) => {
    const contact = await ContactsCollection.findById(contactId);
    return contact;
};
//Метод find() моделі ContactsCollection — це вбудований метод Mongoose для пошуку документів у MongoDB. 
// Викликаючи find() на моделі ContactsCollection, ми отримаємо масив документів, що відповідають моделі Contact. 
// У випадку, якщо колекція контактів порожня, метод повертає порожній масив

//Метод findById() моделі ContactsCollection — це вбудований метод Mongoose для пошуку одного документа у MongoDB за його унікальним ідентифікатором. 
// Викликаючи findById() на моделі ContactsCollection із вказаним ідентифікатором студента, ми отримаємо документ, що відповідає цьому ідентифікатору, як об'єкт Contact. 
// Якщо документ із заданим ідентифікатором не буде знайдено, метод поверне null