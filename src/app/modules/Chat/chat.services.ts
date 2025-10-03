import mongoose from 'mongoose'
import httpStatus from 'http-status'
import { AppError } from '../../Error/AppError'
import { User } from '../User/user.model'
import Chat from './chat.model'

const getOrCreateChatForCustomer = async (customerId: string) => {
  const customerObjectId = new mongoose.Types.ObjectId(customerId)

  let chat = await Chat.findOne({ customer: customerObjectId })

  if (!chat) {
    const anyAdmin = await User.findOne({ role: 'admin' })
    if (!anyAdmin) {
      throw new AppError(httpStatus.NOT_FOUND, 'No admin available for support')
    }

    chat = await Chat.create({
      customer: customerObjectId,
      assignedAdmin: anyAdmin._id,
    })
  }

  const chatDetails = await Chat.aggregate([
    {
      $match: { _id: chat._id },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'customer',
        foreignField: '_id',
        as: 'customerUser',
      },
    },
    {
      $lookup: {
        from: 'customers',
        localField: 'customer',
        foreignField: 'user',
        as: 'customerProfile',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'assignedAdmin',
        foreignField: '_id',
        as: 'adminUser',
      },
    },
    {
      $lookup: {
        from: 'admins',
        localField: 'assignedAdmin',
        foreignField: 'user',
        as: 'adminProfile',
      },
    },
    {
      $unwind: { path: '$customerUser', preserveNullAndEmptyArrays: true },
    },
    {
      $unwind: { path: '$customerProfile', preserveNullAndEmptyArrays: true },
    },
    {
      $unwind: { path: '$adminUser', preserveNullAndEmptyArrays: true },
    },
    {
      $unwind: { path: '$adminProfile', preserveNullAndEmptyArrays: true },
    },
    {
      $project: {
        _id: 1,
        status: 1,
        lastMessage: 1,
        createdAt: 1,
        updatedAt: 1,
        customer: {
          _id: '$customerUser._id',
          email: '$customerUser.email',
          role: '$customerUser.role',
          fullName: '$customerProfile.fullName',
          profileImage: '$customerProfile.profileImage',
        },
        assignedAdmin: {
          _id: '$adminUser._id',
          email: '$adminUser.email',
          role: '$adminUser.role',
          fullName: '$adminProfile.fullName',
          profileImage: '$adminProfile.profileImage',
        },
      },
    },
  ])

  if (!chatDetails || chatDetails.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, 'Chat details not found')
  }

  return chatDetails[0]
}

const getAllChatsForAdmin = async (page: number = 1, limit: number = 20) => {
  const skip = (page - 1) * limit

  const chats = await Chat.aggregate([
    { $sort: { updatedAt: -1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: 'users',
        localField: 'customer',
        foreignField: '_id',
        as: 'customerUser',
      },
    },
    {
      $lookup: {
        from: 'customers',
        localField: 'customer',
        foreignField: 'user',
        as: 'customerProfile',
      },
    },
    {
      $unwind: { path: '$customerUser', preserveNullAndEmptyArrays: true },
    },
    {
      $unwind: { path: '$customerProfile', preserveNullAndEmptyArrays: true },
    },
    {
      $project: {
        _id: 1,
        status: 1,
        lastMessage: 1,
        createdAt: 1,
        updatedAt: 1,
        customer: {
          _id: '$customerUser._id',
          email: '$customerUser.email',
          fullName: '$customerProfile.fullName',
          profileImage: '$customerProfile.profileImage',
        },
      },
    },
  ])

  const total = await Chat.countDocuments()
  const hasMore = skip + limit < total

  return {
    data: chats,
    pagination: {
      page,
      limit,
      total,
      hasMore,
    },
  }
}

export const ChatServices = {
  getOrCreateChatForCustomer,
  getAllChatsForAdmin,
}
