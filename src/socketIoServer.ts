import { Server as HttpServer } from 'http'
import { Server as SocketIOServer, Socket } from 'socket.io'

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

    // নতুন ব্যবহারকারী যোগ করা
    socket.on('new-user-add', (newUserId: string, role: string) => {
      // Remove user if already exists (to handle reconnection)
      activeUsers = activeUsers.filter(user => user.userId !== newUserId)

      activeUsers.push({ userId: newUserId, socketId: socket.id, role })
      console.log('Active users:', activeUsers)
      io.emit('get-users', activeUsers)
    })

    // সংযোগ বিচ্ছিন্ন হ্যান্ডেল করা
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`)
      activeUsers = activeUsers.filter(user => user.socketId !== socket.id)
      io.emit('get-users', activeUsers)
    })

    // একটি চ্যাট রুমে যোগদান করা - FIXED
    socket.on('join-chat', (chatId: string) => {
      socket.join(chatId)
      console.log(`User ${socket.id} joined chat room: ${chatId}`)
    })

    // মেসেজ পাঠানো - FIXED
    socket.on('send-message', data => {
      console.log('Message received on server:', data)

      // Send to specific chat room
      socket.to(data.chatId).emit('receive-message', data)

      // Also send to sender for immediate update
      socket.emit('receive-message', data)
    })

    // অ্যাডমিন যখন একটি চ্যাট দেখছেন
    socket.on('admin-viewing-chat', ({ chatId, adminName }) => {
      socket.to(chatId).emit('viewing-indicator', `${adminName} is viewing...`)
    })

    // অ্যাডমিন যখন টাইপ করা শুরু করবেন
    socket.on('admin-typing-start', ({ chatId, adminName }) => {
      socket
        .to(chatId)
        .emit('typing-indicator-start', `${adminName} is typing...`)
    })

    // অ্যাডমিন যখন টাইপ করা বন্ধ করবেন
    socket.on('admin-typing-stop', ({ chatId }) => {
      socket.to(chatId).emit('typing-indicator-stop')
    })
  })
}
