import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'
import { DemoService } from './demo.service'
import {
  generateHateoasLinks,
  generatePaginationLinks,
} from '../../utils/hateoas'

const createDemoData = catchAsync(async (req, res) => {
  const result = await DemoService.createDemoData(req.body)

  const links = generateHateoasLinks(result, 'demo')

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Demo data created successfully',
    data: result,
    links: links,
  })
})

const getAllData = catchAsync(async (req, res) => {
  const result = await DemoService.getAllData(req.query)
  const path = 'demo'

  const metaWithLinks = {
    ...result.meta,
    links: generatePaginationLinks(result.meta, path),
  }

  const dataWithLinks = result.data.map((item: any) => ({
    ...item.toObject(),
    links: generateHateoasLinks(item, path),
  }))

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'All demo data retrieved successfully',
    meta: metaWithLinks, // Use the new object here
    data: dataWithLinks,
  })
})

const getSingleData = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await DemoService.getSingleData(id)

  if (result) {
    const links = generateHateoasLinks(result, 'demo')

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Single demo data retrieved successfully',
      data: result,
      links: links,
    })
  } else {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      message: 'Demo data not found',
      data: null,
    })
  }
})

const updateDemoData = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await DemoService.updateDemoData(id, req.body)

  // This if/else is ESSENTIAL to prevent a crash.
  if (result) {
    const links = generateHateoasLinks(result, 'demo')
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Demo data updated successfully',
      data: result,
      links: links,
    })
  } else {
    // If result is null, the document was not found.
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      message: 'Demo data not found, nothing updated',
      data: null,
    })
  }
})

const deleteDemoData = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await DemoService.deleteDemoData(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Demo data deleted successfully',
    data: result,
  })
})

export const DemoController = {
  createDemoData,
  getAllData,
  getSingleData,
  updateDemoData,
  deleteDemoData,
}
