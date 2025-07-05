import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'
import { VendorService } from './vendor.service'

const getAllVendors = catchAsync(async (req, res) => {
  const result = await VendorService.getAllVendorsFromDB(req.query)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Vendors get successfully',
    meta: result.count,
    data: result.vendorQuery,
  })
})

const getVendorProfile = catchAsync(async (req, res) => {
  const result = await VendorService.getVendorProfile(req)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Vendor profile get successfully',
    data: result,
  })
})

const updateVendorProfileImg = catchAsync(async (req, res) => {
  const result = await VendorService.updateVendorProfileImage(req)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Vendor profile image updated successfully',
    data: result,
  })
})

const acceptVendor = catchAsync(async (req, res) => {
  const payload = req.body

  const result = await VendorService.acceptVendor(payload)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Vendor accepted successfully',
    data: result,
  })
})

export const VendorController = {
  getAllVendors,
  acceptVendor,
  getVendorProfile,
  updateVendorProfileImg,
}
