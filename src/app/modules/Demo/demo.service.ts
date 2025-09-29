import QueryBuilder from '../../builder/QueryBuilder'
import { IDemo } from './demo.interface'
import { Demo } from './demo.model'

const createDemoData = async (payload: IDemo): Promise<IDemo> => {
  const result = await Demo.create(payload)
  return result
}

const getAllData = async (query: Record<string, unknown>) => {
  const searchableFields = ['name', 'description', 'category']
  const demoQuery = new QueryBuilder(Demo.find(), query)
    .search(searchableFields)
    .filter()
    .sort()
    .pagination()
    .fields()

  const data = await demoQuery.modelQuery
  const meta = await demoQuery.countTotal()

  return {
    meta,
    data,
  }
}

const getSingleData = async (id: string): Promise<IDemo | null> => {
  const result = await Demo.findById(id)
  return result
}

const updateDemoData = async (
  id: string,
  payload: Partial<IDemo>
): Promise<IDemo | null> => {
  const result = await Demo.findByIdAndUpdate(id, payload, { new: true })
  return result
}

const deleteDemoData = async (id: string): Promise<IDemo | null> => {
  const result = await Demo.findByIdAndDelete(id)
  return result
}

export const DemoService = {
  createDemoData,
  getAllData,
  getSingleData,
  updateDemoData,
  deleteDemoData,
}
