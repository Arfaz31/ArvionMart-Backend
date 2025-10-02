import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'
import { ChatServices } from './chat.services'

const getCustomerChat = catchAsync(async (req, res) => {
  const { customerId } = req.params
  const result = await ChatServices.getOrCreateChatForCustomer(customerId)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Chat retrieved successfully',
    data: result,
  })
})

const getAdminChats = catchAsync(async (req, res) => {
  const result = await ChatServices.getAllChatsForAdmin()
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All chats retrieved for admin',
    data: result,
  })
})

export const ChatController = {
  getCustomerChat,
  getAdminChats,
}
