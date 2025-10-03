import dotenv from 'dotenv'

dotenv.config()

export const environment = process.env.NODE_ENV
export const logDirectory = process.env.LOG_DIRECTORY

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  redis_url: process.env.REDIS_URL,
  salt_rounds: process.env.SALT_ROUNDS,
  cloudinary: {
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  },
  jwt: {
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_access_expirein: process.env.JWT_ACCESS_EXPIREIN,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_refresh_expirein: process.env.JWT_REFRESH_EXPIREIN,
  },
  super_admin_email: process.env.SUPER_ADMIN_EMAIL,
  super_admin_password: process.env.SUPER_ADMIN_PASSWORD,
  super_admin_contact_number: process.env.SUPER_ADMIN_CONTACT_NUMBER,
  ssl: {
    store_id: process.env.STORE_ID,
    store_pass: process.env.STORE_PASS,
    success_url: process.env.SUCCESS_URL,
    fail_url: process.env.FAILED_URL,
    cancel_url: process.env.CANCEL_URL,
    ssl_payment_api: process.env.SSL_PAYMENT_API,
    ssl_validation_api: process.env.SSL_VALIDATION_API,
  },
  email_sender_user: process.env.EMAIL_SENDER_USER,
  email_sender_pass: process.env.EMAIL_SENDER_PASS,
}
