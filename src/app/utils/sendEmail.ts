import nodemailer from 'nodemailer'

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
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 5000,    // 5 seconds
    socketTimeout: 10000,     // 10 seconds
    auth: {
      user: 'sohagali.ru.ac@gmail.com',
      pass: 'game issn revh mzcw',
    },
  })

  // Add timeout wrapper
  const emailPromise = transporter.sendMail({
    from: 'sohagali.ru.ac@gmail.com',
    to: email,
    subject: subject,
    text: text,
    html: html,
  })

  // Race between email sending and timeout
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Email sending timeout')), 15000)
  })

  await Promise.race([emailPromise, timeoutPromise])
}
