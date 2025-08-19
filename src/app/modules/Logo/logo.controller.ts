import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'

import httpStatus from 'http-status'
import { LogoService } from './logo.services'

const createLogoIntoDB = catchAsync(async (req, res) => {
  const result = await LogoService.createLogo(req)
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Logo created successfully',
    data: result,
  })
})

const getAllLogosFromDB = catchAsync(async (req, res) => {
  const result = await LogoService.getAllLogos(req.query)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Logos fetched successfully',
    meta: result.count,
    data: result.logoQuery,
  })
})

const updateLogoIntoDB = catchAsync(async (req, res) => {
  const id = req.params.id
  const payload = req.body
  const file = req.file

  const result = await LogoService.updateLogo(id, payload, file)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Logo updated successfully',
    data: result,
  })
})

const deleteLogoFromDB = catchAsync(async (req, res) => {
  const id = req.params.id
  const result = await LogoService.deleteLogo(id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Logo deleted successfully',
    data: result,
  })
})

export const LogoController = {
  createLogoIntoDB,
  getAllLogosFromDB,
  updateLogoIntoDB,
  deleteLogoFromDB,
}
