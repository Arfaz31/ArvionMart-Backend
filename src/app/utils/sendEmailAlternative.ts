import nodemailer from 'nodemailer'
import config from '../config'

export const sendEmailAlternative = async (
  email: string,
  html: string,
  subject: string,
  text: string
) => {
  try {
    // Use environment variables for email config
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: config.email_sender_user,
        pass: config.email_sender_pass,
      },
      connectionTimeout: 10000,
    })

    await transporter.sendMail({
      from: config.email_sender_user,
      to: email,
      subject: subject,
      text: text,
      html: html,
    })
  } catch (error) {
    console.error('Email sending failed:', error)
    // Don't throw error to prevent API timeout
  }
}
