import nodemailer from 'nodemailer'

export const sendEmail = async (email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: 'sohagali.ru.ac@gmail.com',
      pass: 'game issn revh mzcw',
    },
  })

  await transporter.sendMail({
    from: 'sohagali.ru.ac@gmail.com',
    to: email,
    subject: 'Reset Password Link',
    text: 'Reset your password within 10 minutes', // plain text body
    html: html, // html body
  })
}
