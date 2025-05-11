import { model, Schema } from 'mongoose';
const contactsSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        email: {
            type: String,
        },
        isFavourite: {
            type: Boolean,
            default: false,
        },
        contactType: {
            type: String,
            enum: ['work', 'home', 'personal'],
            required: true,
            default: 'personal',
        },
    },
    {
        //Для автоматичного створення полів createdAt та updatedAt, 
        // можна використати параметр timestamps: true 
        // при створенні моделі. 
        // Це додає до об'єкту два поля: createdAt (дата створення) та updatedAt (дата оновлення), і їх не потрібно додавати вручну.
       timestamps: true, 
    },
);
export const ContactsCollection = model('Contact', contactsSchema); // collection name: contacts(зводить до нижнього регістру та у множині)