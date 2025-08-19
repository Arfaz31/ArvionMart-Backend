import catchAsync from '../../utils/catchAsync'
import httpStatus from 'http-status'
import { ContactInfoService } from './contactInfo.services'
import sendResponse from '../../utils/sendResponse'

const createContactInfoIntoDB = catchAsync(async (req, res) => {
  const result = await ContactInfoService.createContactInfo(req.body)
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'ContactInfo created successfully',
    data: result,
  })
})

const getAllContactInfoFromDB = catchAsync(async (req, res) => {
  const result = await ContactInfoService.getContactInfo()
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'ContactInfo get successfully',
    data: result,
  })
})

const updateContactInfoIntoDB = catchAsync(async (req, res) => {
  const result = await ContactInfoService.updateContactInfo(req)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'ContactInfo updated successfully',
    data: result,
  })
})

const deleteContactInfoFromDB = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await ContactInfoService.deleteContactInfo(id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'ContactInfo deleted successfully',
    data: result,
  })
})

export const ContactInfoController = {
  createContactInfoIntoDB,
  getAllContactInfoFromDB,
  updateContactInfoIntoDB,
  deleteContactInfoFromDB,
}
