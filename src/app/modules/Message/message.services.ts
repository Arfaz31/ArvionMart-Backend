import mongoose from 'mongoose'
import { Request } from 'express'
import httpStatus from 'http-status'
import { AppError } from '../../Error/AppError'
import Chat from '../Chat/chat.model'
import { User } from '../User/user.model'
import { IMessage } from './message.interface'
import Message from './message.model'

const addMessage = async (req: Request) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] }
  // console.log('🔍 Debugging:')
  // console.log('req.body:', req.body)
  // console.log('req.files:', req.files)
  // console.log('files variable:', files)
  // Parse data from FormData (sent as JSON string)
  let payload: Partial<IMessage> = {}
  if (req.body.data) {
    try {
      payload = JSON.parse(req.body.data)
    } catch (error) {
      payload = req.body // fallback to direct body
    }
  } else {
    payload = req.body
  }

  const { chatId, senderId, text } = payload

  console.log('payload', payload)
  console.log('files', files)

  if (!chatId || !senderId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Chat ID and Sender ID are required'
    )
  }

  // Check করুন: text আছে কিনা বা files আছে কিনা
  const hasText = text && text.trim().length > 0
  const hasFiles = files && files['images'] && files['images'].length > 0

  if (!hasText && !hasFiles) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Message must contain text or images.'
    )
  }

  const sender = await User.findById(senderId)
  if (!sender) {
    throw new AppError(httpStatus.NOT_FOUND, 'Sender not found')
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

    // Text add করুন যদি থাকে
    if (hasText) {
      messageData.text = text!.trim()
    }

    // Images add করুন যদি থাকে
    if (hasFiles) {
      messageData.imageUrls = files['images'].map(file => file.path)
    }

    // Admin assignment check করুন
    if (
      sender &&
      (sender.role === 'admin' || sender.role === 'superAdmin') &&
      !chat.assignedAdmin
    ) {
      chat.assignedAdmin = sender._id
      chat.status = 'In-Progress'
    }

    // Message create করুন
    const newMessage = await Message.create(messageData)

    // Chat এর lastMessage update করুন
    if (hasText) {
      chat.lastMessage = text!.trim()
    } else if (messageData.imageUrls && messageData.imageUrls.length > 0) {
      chat.lastMessage = `${messageData.imageUrls.length} image(s) sent`
    }

    await chat.save()

    // Populated message return করুন
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
  const { chatId, senderId, text } = payload

  if (!chatId || !senderId || !text) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Chat ID, Sender ID, and text are required'
    )
  }

  try {
    const messageData: Partial<IMessage> = {
      chatId: new mongoose.Types.ObjectId(chatId),
      senderId: new mongoose.Types.ObjectId(senderId),
      text: text.trim(),
    }

    const newMessage = await Message.create(messageData)

    // Update chat last message
    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: text.trim(),
      updatedAt: new Date(),
    })

    // Get populated message
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

const getMessages = async (
  chatId: string,
  page: number = 1,
  limit: number = 20
) => {
  const pageNumber = page || 1
  const messageLimit = limit || 20
  const skip = (pageNumber - 1) * messageLimit

  const messages = await Message.aggregate([
    { $match: { chatId: new mongoose.Types.ObjectId(chatId) } },
    { $sort: { createdAt: -1 } }, // Latest first
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
  ]).sort({ createdAt: 1 })

  // Reverse to show oldest first in UI
  return messages
}

export const MessageServices = {
  addMessage,
  getMessages,
  addMessageFromSocket,
}
