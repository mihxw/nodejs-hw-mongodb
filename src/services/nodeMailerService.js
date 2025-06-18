import nodemailer from 'nodemailer';

const mailOptionGenerator = ({ from, to, subject, text }) => {
  return { from, to, subject, text };
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your.email@gmail.com',
    pass: 'your_app_password',
  },
});

export default { transporter, mailOptionGenerator };