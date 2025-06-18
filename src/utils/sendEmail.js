import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { SMTP } from '../constants/constants.js';
import { getEnvWar } from './getEnv.js';

dotenv.config();
const transporter = nodemailer.createTransport({
  host: getEnvWar(SMTP.SMTP_HOST),
  port: parseInt(getEnvWar(SMTP.SMTP_PORT), 10),
  secure: false,
  auth: {
    user: getEnvWar(SMTP.SMTP_USER),
    pass: getEnvWar(SMTP.SMTP_PASSWORD),
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  const mail = {
    from: getEnvWar(SMTP.SMTP_FROM),
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mail);

    return info;
  } catch (err) {
    console.error('Email sending failed:', err);
    throw err;
  }
};