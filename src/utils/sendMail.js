import nodemailer from 'nodemailer';
import { getEnvVar } from './getEnvVar.js';

const transporter = nodemailer.createTransport({
  host: getEnvVar('SMTP_HOST'),
  port: getEnvVar('SMTP_PORT'),
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: getEnvVar('SMTP_USER'),
    pass: getEnvVar('SMTP_PASSWORD'),
  },
});

export function sendMail(to, subject, html) {
  return transporter.sendMail({
    from: getEnvVar('SMTP_FROM'),
    to,
    subject,
    html,
  });
}