import nodemailer from 'nodemailer'
import config from '../config'

export const sendEmail = async (
  email: string,
  html: string,
  subject: string,
  text: string
) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: config.email_sender_user,
      pass: config.email_sender_pass,
    },
  })

  await transporter.sendMail({
    from: config.email_sender_user,
    to: email,
    subject: subject,
    text: text,
    html: html,
  })
}
