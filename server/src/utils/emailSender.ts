
import * as nodemailer from 'nodemailer';
import { TransportOptions } from 'nodemailer';
require('dotenv').config();

const sendEmail = async (options: { email: string; subject: string; message: string }) => {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  } as TransportOptions);

  let message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(message);
};

export { sendEmail };