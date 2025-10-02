import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'
import { MessageServices } from './message.services'
import { Request, Response } from 'express'

const createMessage = catchAsync(async (req: Request, res: Response) => {
  const result = await MessageServices.addMessage(req)
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Message sent successfully',
    data: result,
  })
})

const createMessageFromSocket = catchAsync(
  async (req: Request, res: Response) => {
    const result = await MessageServices.addMessageFromSocket(req.body)
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Message created via socket',
      data: result,
    })
  }
)

const getAllMessages = catchAsync(async (req: Request, res: Response) => {
  const { chatId } = req.params

  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 20

  const result = await MessageServices.getMessages(chatId, page, limit)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Messages retrieved successfully',
    data: result,
  })
})

const MessageController = {
  createMessage,
  getAllMessages,
  createMessageFromSocket,
}

export default MessageController
