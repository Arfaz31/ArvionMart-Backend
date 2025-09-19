import { Request } from 'express'
import { CustomFile } from '../Variant/variant.service'
import { Blog } from './blog.model'
import { AppError } from '../../Error/AppError'
import httpStatus from 'http-status'
import QueryBuilder from '../../builder/QueryBuilder'
import { IBlog } from './blog.interface'
import { Types } from 'mongoose'

const createBlog = async (req: Request) => {
  const payload = req.body
  const file = req.file

  payload.blogImage = file?.path

  const result = await Blog.create(payload)
  return result
}

// backend: blog.service.ts
const getAllBlog = async (query: Record<string, unknown>) => {
  // Clean the query to handle category filtering properly
  const cleanedQuery = { ...query }

  // Handle category filtering - remove empty or invalid values
  if (cleanedQuery.category) {
    const categoryValue = cleanedQuery.category as string

    // If category is empty string, null, undefined, or "all", remove it
    if (
      !categoryValue ||
      categoryValue.trim() === '' ||
      categoryValue === 'all'
    ) {
      delete cleanedQuery.category
    } else if (!Types.ObjectId.isValid(categoryValue)) {
      // If it's not a valid ObjectId, remove it
      delete cleanedQuery.category
    }
  }

  // Handle search term - remove if empty
  if (
    cleanedQuery.searchTerm &&
    (cleanedQuery.searchTerm as string).trim() === ''
  ) {
    delete cleanedQuery.searchTerm
  }

  const updatedQuery = { ...cleanedQuery, sort: '-createdAt' }

  const blogQuery = await new QueryBuilder(
    Blog.find().populate('category'),
    updatedQuery
  )
    .search(['title', 'description'])
    .filter()
    .sort()
    .pagination()
    .fields().modelQuery

  const count = await new QueryBuilder(Blog.find(), updatedQuery).countTotal()

  return { count, blogQuery }
}

const getSingleBlog = async (id: string) => {
  const blog = await Blog.findById(id).populate('category')
  return blog
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
  getSingleBlog,
  updateBlog,
  deleteBlog,
}
