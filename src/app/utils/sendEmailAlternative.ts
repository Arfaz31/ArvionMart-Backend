import nodemailer from 'nodemailer'

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
        user: process.env.EMAIL_USER || 'sohagali.ru.ac@gmail.com',
        pass: process.env.EMAIL_PASS || 'game issn revh mzcw',
      },
      connectionTimeout: 10000,
    })

    await transporter.sendMail({
      from: process.env.EMAIL_USER || 'sohagali.ru.ac@gmail.com',
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
