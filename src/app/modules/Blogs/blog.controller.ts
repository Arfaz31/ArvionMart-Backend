import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { BlogService } from './blog.services'
import httpStatus from 'http-status'

const createBlogIntoDB = catchAsync(async (req, res) => {
  const result = await BlogService.createBlog(req)
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Blog created successfully',
    data: result,
  })
})

const getAllBlogFromDB = catchAsync(async (req, res) => {
  const result = await BlogService.getAllBlog(req.query)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Blogs fetched successfully',
    meta: result.count,
    data: result.blogQuery,
  })
})

const updateBlogIntoDB = catchAsync(async (req, res) => {
  const id = req.params.id
  const payload = req.body
  const file = req.file

  const result = await BlogService.updateBlog(id, payload, file)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Blog updated successfully',
    data: result,
  })
})

const deleteBlogFromDB = catchAsync(async (req, res) => {
  const id = req.params.id
  const result = await BlogService.deleteBlog(id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Blog deleted successfully',
    data: result,
  })
})

export const BlogController = {
  createBlogIntoDB,
  getAllBlogFromDB,
  updateBlogIntoDB,
  deleteBlogFromDB,
}
