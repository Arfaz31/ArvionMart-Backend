import { FilterQuery, Query } from 'mongoose'

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>
  public query: Record<string, unknown>
  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery
    this.query = query
  }

  //method
  search(searchAbleField: string[]) {
    if (this?.query?.searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchAbleField.map(
          field =>
            ({
              [field]: { $regex: this.query.searchTerm, $options: 'i' },
            } as FilterQuery<T>)
        ),
      })
    }
    return this
  }

  //method
  filter() {
    const queryObj = { ...this.query }
    const excludeFields = [
      'searchTerm',
      'sort',
      'page',
      'limit',
      'fields',
      'minPrice',
      'maxPrice',
    ]
    excludeFields.forEach(field => {
      delete queryObj[field]
    })

    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>)
    return this
  }

  //method
  sort() {
    const sort = (this.query.sort as string) || '-createdAt'
    this.modelQuery = this.modelQuery.sort(sort as string)
    return this
  }

  //pegination
  pagination() {
    const page = Number(this.query.page) || 1
    const limit = Number(this.query.limit) || 10
    const skip = (page - 1) * limit
    this.modelQuery = this.modelQuery.skip(skip).limit(limit)
    return this
  }

  fields() {
    const fields =
      (this.query.fields as string)?.split(',')?.join(' ') || '-__v'
    this.modelQuery = this.modelQuery.select(fields)
    return this
  }

  async countTotal() {
    const totalQueries = this.modelQuery.getFilter()
    const total = await this.modelQuery.model.countDocuments(totalQueries)
    const page = Number(this?.query?.page) || 1
    const limit = Number(this?.query?.limit) || 10
    const totalPage = Math.ceil(total / limit)

    return {
      page,
      limit,
      total,
      totalPage,
    }
  }
}

export default QueryBuilder
