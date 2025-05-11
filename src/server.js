
import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { getEnvVar } from './utils/getEnvVar.js';
import { getAllContacts, getContactById } from './services/contacts.js';

// Читаємо змінну оточення PORT
const PORT = Number(getEnvVar('PORT', '3000'));

export const setupServer = async () => {
    const app = express();
    app.use(express.json());
    app.use(cors());
    app.use(
        //це опція, яка дозволяє визначити, як виводити логи.
        //target: 'pino-pretty' означає, що Pino не буде виводити JSON-логи (за замовчуванням), а використовуватиме більш читабельний формат для розробки.
        pino({
            transport: {
                target: 'pino-pretty',

            },
        }),
    );
    app.get('/', (req, res) => {
        res.json({message: "All work" });
    });

        app.get('/contacts', async (req, res) => {
        try {
        const contacts = await getAllContacts();
        res.status(200).json({
 status: 200,
  message: "Successfully found contacts!",
  data: contacts,
        });
        } catch (error) {
            console.error(error);
            }
        });
    
    app.get('/contacts/:contactId', async (req, res, next) => {
        try {
            //Властивість params на об'єкті запиту req містить об'єкт динамічних параметрів маршруту, 
            // де кожне ім'я параметру відповідає властивості у цьому об'єкті, 
            // а значення, передане у URL, стає значенням цієї властивості. 
            const { contactId } = req.params;
        const contact = await getContactById(contactId);

            if (!contact) {
                res.status(404).json({
                    message: 'Contact not found'
                });
                    return;
            }
            
            res.status(200).json({
                status: 200,
                message: `Successfully found contact with id ${contactId}!`,
                data:
                    contact,
            });
        } catch (error) {
      console.error(error);
    }
    });
    //Обробку неіснуючих роутів (повертає статус 404 і відповідне повідомлення)
    app.use((req, res, next) => {
    res.status(404).json({
        message: 'Not found',
    });
    });

    app.use((err, req, res, next) => {
        res.status(500).json({
            message: 'Something went wrong',
            error: err.message,
        });
    });
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
};