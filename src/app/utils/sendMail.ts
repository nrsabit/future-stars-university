import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'production',
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: 'mailbox.sabit@gmail.com',
      pass: 'bamv zrou etpx inej',
    },
  });

  transporter.sendMail({
    from: '"NR Sabit" <mailbox.sabit@gmail.com>', // sender address
    to,
    subject: 'Reset Your Password within 10 Minutes', // Subject line
    text: 'Please Reset the password', // plain text body
    html,
  });
};
