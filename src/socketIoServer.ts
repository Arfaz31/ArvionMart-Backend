import { Server as HttpServer } from 'http'
import { Server as SocketIOServer, Socket } from 'socket.io'
import { MessageServices } from './app/modules/Message/message.services'

let activeUsers: Array<{ userId: string; socketId: string; role: string }> = []

export const socketServer = (server: HttpServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`)

    socket.on('new-user-add', (newUserId: string, role: string) => {
      activeUsers = activeUsers.filter(user => user.userId !== newUserId)
      activeUsers.push({ userId: newUserId, socketId: socket.id, role })
      console.log('Active users:', activeUsers)
      io.emit('get-users', activeUsers)
    })

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`)
      activeUsers = activeUsers.filter(user => user.socketId !== socket.id)
      io.emit('get-users', activeUsers)
    })

    socket.on('join-chat', (chatId: string) => {
      socket.join(chatId)
      console.log(`User ${socket.id} joined chat room: ${chatId}`)
    })

    // Text message এর জন্য
    socket.on('send-message', async data => {
      try {
        // console.log('Processing text message:', data)

        // Save message to database
        const savedMessage = await MessageServices.addMessageFromSocket(data)
        console.log('Message saved:', savedMessage._id)

        // Broadcast to ALL users in the chat room (including sender)
        io.in(data.chatId).emit('receive-message', savedMessage)
        console.log('Message broadcasted to room:', data.chatId)
      } catch (error) {
        console.error('Error processing message:', error)
        socket.emit('message-error', {
          error: 'Failed to send message',
          originalMessage: data,
        })
      }
    })

    // File message API থেকে আসলে এটা broadcast করবে
    socket.on('file-message-sent', messageData => {
      try {
        console.log('Broadcasting file message:', messageData._id)
        // যে message API থেকে create হয়েছে সেটা broadcast করুন
        io.in(messageData.chatId.toString()).emit(
          'receive-message',
          messageData
        )
        console.log('File message broadcasted to room:', messageData.chatId)
      } catch (error) {
        console.error('Error broadcasting file message:', error)
      }
    })

    socket.on('typing-start', ({ chatId, userName }) => {
      socket.to(chatId).emit('typing-indicator', { userName, isTyping: true })
    })

    socket.on('typing-stop', ({ chatId }) => {
      socket.to(chatId).emit('typing-indicator', { isTyping: false })
    })
  })
}
