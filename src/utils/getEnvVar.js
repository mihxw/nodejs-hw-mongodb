import dotenv from "dotenv";
//Щоб зчитувати та використовувати змінні оточення в додатку
dotenv.config();
//З урахуванням можливості відсутності змінної оточення, створюємо утилітарну функцію, 
// яка перевірятиме її наявність і генеруватиме помилку, 
// якщо змінна не встановлена. 
export function getEnvVar(name, defaultValue) {
    const value = process.env[name];

    if (value) return value;
    if (defaultValue) return defaultValue;

    throw new Error(`Missing: process.env[${name}].`);
}
// Використати її ми можемо, наприклад, 
// в такому вигляді: env('PORT', '3000');
// Якщо змінної оточення з такою назвою 
// не було вказано і не було передано дефолтного значення,
// то виклик цієї функції викине помилку 
// з повідомленням Missing: process.env['PORT'].