import { Request } from 'express'
import { CustomFile } from '../Variant/variant.service'
import { Blog } from './blog.model'
import { AppError } from '../../Error/AppError'
import httpStatus from 'http-status'
import QueryBuilder from '../../builder/QueryBuilder'
import { IBlog } from './blog.interface'

const createBlog = async (req: Request) => {
  const payload = req.body
  const file = req.file

  payload.blogImage = file?.path

  const result = await Blog.create(payload)
  return result
}

const getAllBlog = async (query: Record<string, unknown>) => {
  const updatedQuery = { ...query, sort: '-createdAt' }

  const blogQuery = await new QueryBuilder(
    Blog.find().populate('category'),
    updatedQuery
  )
    .search([])
    .filter()
    .sort()
    .pagination()
    .fields().modelQuery

  const count = await new QueryBuilder(Blog.find(), updatedQuery).countTotal()

  return { count, blogQuery }
}

const updateBlog = async (
  id: string,
  payload: Partial<IBlog>,
  file?: CustomFile
) => {
  if (file) payload.blogImage = file.path

  const updatedBlog = await Blog.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })

  if (!updatedBlog) throw new AppError(httpStatus.NOT_FOUND, 'Blog not found')

  return updatedBlog
}

const deleteBlog = async (id: string) => {
  const deletedBlog = await Blog.findByIdAndDelete(id)

  if (!deletedBlog) throw new AppError(httpStatus.NOT_FOUND, 'Blog not found')

  return deletedBlog
}

export const BlogService = {
  createBlog,
  getAllBlog,
  updateBlog,
  deleteBlog,
}
