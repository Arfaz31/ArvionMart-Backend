import app from './app'
import mongoose from 'mongoose'
import config from './app/config'
import { Server } from 'http'
import seedSuperAdmin from './app/DB'
// import Logger from './app/core/Logger'

const port = process.env.PORT || config.port

let server: Server

async function main() {
  try {
    // Connect to MongoDB and wait for it to finish
    await mongoose.connect(config.database_url as string)
    console.log('✅ Database connection successful!')
    seedSuperAdmin()
    server = app.listen(port, () => {
      console.log(
        `🚀 ArvionMart server is running at http://192.168.0.104:${port}`
      )
      // Logger.info(
      //   `🚀 ArvionMart server is running at http://192.168.0.104:${port}`
      // )
    })
  } catch (error) {
    console.error('❌ Failed to connect to the database:', error)
  }
}

main()

process.on('unhandledRejection', () => {
  console.log(`🤷‍♂️ Unhandled rejection, shutting down...`)
  if (server) {
    server.close(() => {
      process.exit(1)
    })
  }
  process.exit(1)
})

process.on('uncaughtException', () => {
  console.log(`🤷‍♂️ Uncaught exception, shutting down...`)
  process.exit(1)
})
