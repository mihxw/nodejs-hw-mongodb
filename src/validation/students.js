import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': ' Має  бути текстом',
    'string.min': 'Поле name має містити щонайменше 3 символи',
    'string.max': ' Поле name має містити не більше 20 символів',
    'any.required': 'Поле name є обовʼязковим полем',
  }),
  phoneNumber: Joi.string()
    .pattern(/^[\d\+\-\(\)\s]+$/)
    .min(3)
    .max(16)
    .required()
    .messages({
      'string.pattern.base':
        ' Поле phoneNumber має містити лише цифри, пробіли, дужки, плюс або мінус',
      'string.min': ' Поле phoneNumber має містити щонайменше 3 символи',
      'string.max': 'Поле phoneNumber має містити не більше 16 символів',
      'any.required': 'Поле phoneNumber є обовʼязковим полем',
    }),
  email: Joi.string().email().min(3).max(40).required().messages({
    'string.email': ' Поле email має бути валідною електронною адресою',
    'string.min': ' Поле email має містити щонайменше 3 символи',
    'string.max': ' Поле email має містити не більше 40 символів',
    'any.required': ' Поле email є обовʼязковим полем',
  }),
  isFavourite: Joi.boolean().default(false).messages({
    'boolean.base': ' Поле isFavourite має бути булевим значенням (true/false)',
  }),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .required()
    .messages({
      'any.only': ' Поле contactType має бути одним із: work, home, personal',
      'any.required': ' Поле contactType є обовʼязковим полем',
    }),
  parentId: Joi.string().custom((value, helper) => {
    if (value && !isValidObjectId(value)) {
      return helper.message('Parent id should be a valid mongo id');
    }
    return true;
  }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.base': 'Поле name має бути текстом',
    'string.min': ' Поле name має містити щонайменше 3 символи',
    'string.max': ' Поле name має містити не більше 20 символів',
  }),
  phoneNumber: Joi.string().min(3).max(16).messages({
    'string.min': ' Поле phoneNumber має містити щонайменше 3 символи',
    'string.max': ' Поле phoneNumber має містити не більше 16 символів',
  }),
  email: Joi.string().email().messages({
    'string.email': 'Поле email має бути валідною електронною адресою',
  }),
  isFavourite: Joi.boolean().messages({
    'boolean.base': 'Поле isFavourite має бути булевим значенням (true/false)',
  }),
  contactType: Joi.string().valid('work', 'home', 'personal').messages({
    'any.only': 'Поле contactType має бути одним із: work, home, personal',
  }),
});