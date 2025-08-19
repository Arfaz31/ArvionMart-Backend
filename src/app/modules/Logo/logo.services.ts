import { Request } from 'express'
import { Logo } from './logo.model'
import { AppError } from '../../Error/AppError'
import httpStatus from 'http-status'
import QueryBuilder from '../../builder/QueryBuilder'
import { ILogo } from './logo.interface'
import { CustomFile } from '../Variant/variant.service'

const createLogo = async (req: Request) => {
  const payload = req.body
  const file = req.file

  payload.image = file?.path

  const result = await Logo.create(payload)
  return result
}

const getAllLogos = async (query: Record<string, unknown>) => {
  const updatedQuery = {
    ...query,
    sort: '-status order',
  }

  const logoQuery = await new QueryBuilder(Logo.find(), updatedQuery)
    .search([])
    .filter()
    .sort()
    .pagination()
    .fields().modelQuery

  const count = await new QueryBuilder(Logo.find(), updatedQuery).countTotal()

  return {
    count,
    logoQuery,
  }
}

const updateLogo = async (
  id: string,
  payload: Partial<ILogo>,
  file?: CustomFile
) => {
  if (file) {
    payload.image = file?.path
  }

  const updatedLogo = await Logo.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })

  if (!updatedLogo) {
    throw new AppError(httpStatus.NOT_FOUND, 'Logo not found')
  }

  return updatedLogo
}

const deleteLogo = async (id: string) => {
  const deletedLogo = await Logo.findByIdAndDelete(id)

  if (!deletedLogo) {
    throw new AppError(httpStatus.NOT_FOUND, 'Logo not found')
  }

  return deletedLogo
}

export const LogoService = {
  createLogo,
  getAllLogos,
  updateLogo,
  deleteLogo,
}
