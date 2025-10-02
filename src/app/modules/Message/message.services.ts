import mongoose from 'mongoose'
import { Request } from 'express'
import httpStatus from 'http-status'
import { AppError } from '../../Error/AppError'
import Chat from '../Chat/chat.model'
import { User } from '../User/user.model'
import { IMessage } from './message.interface'
import Message from './message.model'

const addMessage = async (req: Request) => {
  const payload: Partial<IMessage> = req.body
  const files = req.files as { [fieldname: string]: Express.Multer.File[] }

  const { chatId, senderId, text } = payload

  if (!chatId || !senderId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Chat ID and Sender ID are required'
    )
  }

  if (!text && (!files || !files['images'] || files['images'].length === 0)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Message must contain text or images.'
    )
  }

  try {
    const chat = await Chat.findById(chatId)
    if (!chat) {
      throw new AppError(httpStatus.NOT_FOUND, 'Chat not found')
    }

    const messageData: Partial<IMessage> = {
      chatId: new mongoose.Types.ObjectId(chatId as unknown as string),
      senderId: new mongoose.Types.ObjectId(senderId as unknown as string),
    }

    if (text) {
      messageData.text = text
    }

    if (files && files['images'] && files['images'].length > 0) {
      messageData.imageUrls = files['images'].map(file => file.path)
    }

    const sender = await User.findById(senderId)
    if (
      sender &&
      (sender.role === 'admin' || sender.role === 'superAdmin') &&
      !chat.assignedAdmin
    ) {
      chat.assignedAdmin = sender._id
      chat.status = 'In-Progress'
    }

    const newMessage = await Message.create(messageData)

    if (text) {
      chat.lastMessage = text
    } else if (messageData.imageUrls && messageData.imageUrls.length > 0) {
      chat.lastMessage = `${messageData.imageUrls.length} image(s) sent`
    }

    await chat.save()

    // FIXED: Use aggregation to properly populate sender info
    const populatedMessage = await Message.aggregate([
      { $match: { _id: newMessage._id } },
      {
        $lookup: {
          from: 'users',
          localField: 'senderId',
          foreignField: '_id',
          as: 'senderInfo',
        },
      },
      { $unwind: '$senderInfo' },
      {
        $lookup: {
          from: 'customers',
          localField: 'senderId',
          foreignField: 'user',
          as: 'customerProfile',
        },
      },
      {
        $lookup: {
          from: 'admins',
          localField: 'senderId',
          foreignField: 'user',
          as: 'adminProfile',
        },
      },
      {
        $unwind: { path: '$customerProfile', preserveNullAndEmptyArrays: true },
      },
      { $unwind: { path: '$adminProfile', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          chatId: 1,
          text: 1,
          imageUrls: 1,
          createdAt: 1,
          updatedAt: 1,
          senderId: '$senderInfo._id',
          sender: {
            _id: '$senderInfo._id',
            email: '$senderInfo.email',
            role: '$senderInfo.role',
            fullName: {
              $ifNull: ['$customerProfile.fullName', '$adminProfile.fullName'],
            },
            profileImage: {
              $ifNull: [
                '$customerProfile.profileImage',
                '$adminProfile.profileImage',
              ],
            },
          },
        },
      },
    ])

    return populatedMessage[0]
  } catch (error) {
    console.error('Error adding message:', error)
    throw error
  }
}

const addMessageFromSocket = async (payload: any) => {
  const { chatId, senderId, text, imageUrls } = payload

  if (!chatId || !senderId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Chat ID and Sender ID are required'
    )
  }

  try {
    const messageData: Partial<IMessage> = {
      chatId: new mongoose.Types.ObjectId(chatId),
      senderId: new mongoose.Types.ObjectId(senderId),
    }

    if (text) {
      messageData.text = text
    }

    if (imageUrls && imageUrls.length > 0) {
      messageData.imageUrls = imageUrls
    }

    const newMessage = await Message.create(messageData)

    // Update chat last message
    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: text || `${imageUrls?.length || 0} image(s) sent`,
      updatedAt: new Date(),
    })

    // FIXED: Use aggregation to properly populate sender info
    const populatedMessage = await Message.aggregate([
      { $match: { _id: newMessage._id } },
      {
        $lookup: {
          from: 'users',
          localField: 'senderId',
          foreignField: '_id',
          as: 'senderInfo',
        },
      },
      { $unwind: '$senderInfo' },
      {
        $lookup: {
          from: 'customers',
          localField: 'senderId',
          foreignField: 'user',
          as: 'customerProfile',
        },
      },
      {
        $lookup: {
          from: 'admins',
          localField: 'senderId',
          foreignField: 'user',
          as: 'adminProfile',
        },
      },
      {
        $unwind: { path: '$customerProfile', preserveNullAndEmptyArrays: true },
      },
      { $unwind: { path: '$adminProfile', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          chatId: 1,
          text: 1,
          imageUrls: 1,
          createdAt: 1,
          updatedAt: 1,
          senderId: '$senderInfo._id',
          sender: {
            _id: '$senderInfo._id',
            email: '$senderInfo.email',
            role: '$senderInfo.role',
            fullName: {
              $ifNull: ['$customerProfile.fullName', '$adminProfile.fullName'],
            },
            profileImage: {
              $ifNull: [
                '$customerProfile.profileImage',
                '$adminProfile.profileImage',
              ],
            },
          },
        },
      },
    ])

    return populatedMessage[0]
  } catch (error) {
    console.error('Error adding message via socket:', error)
    throw error
  }
}

const getMessages = async (chatId: string, page: number, limit: number) => {
  const pageNumber = page || 1
  const messageLimit = limit || 20
  const skip = (pageNumber - 1) * messageLimit

  const messages = await Message.aggregate([
    { $match: { chatId: new mongoose.Types.ObjectId(chatId) } },
    { $sort: { createdAt: 1 } },
    { $skip: skip },
    { $limit: messageLimit },
    {
      $lookup: {
        from: 'users',
        localField: 'senderId',
        foreignField: '_id',
        as: 'senderInfo',
      },
    },
    { $unwind: '$senderInfo' },
    {
      $lookup: {
        from: 'customers',
        localField: 'senderId',
        foreignField: 'user',
        as: 'customerProfile',
      },
    },
    {
      $lookup: {
        from: 'admins',
        localField: 'senderId',
        foreignField: 'user',
        as: 'adminProfile',
      },
    },
    { $unwind: { path: '$customerProfile', preserveNullAndEmptyArrays: true } },
    { $unwind: { path: '$adminProfile', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        chatId: 1,
        text: 1,
        imageUrls: 1,
        createdAt: 1,
        updatedAt: 1,
        senderId: '$senderInfo._id',
        sender: {
          _id: '$senderInfo._id',
          email: '$senderInfo.email',
          role: '$senderInfo.role',
          fullName: {
            $ifNull: ['$customerProfile.fullName', '$adminProfile.fullName'],
          },
          profileImage: {
            $ifNull: [
              '$customerProfile.profileImage',
              '$adminProfile.profileImage',
            ],
          },
        },
      },
    },
  ])

  return messages
}

export const MessageServices = {
  addMessage,
  getMessages,
  addMessageFromSocket,
}
