import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  constructor(
    public modelQuery: Query<T[], T>,
    public query: Record<string, unknown>,
  ) {}

  search(searchableFields: string[]) {
    const searchTerm = this?.query?.searchTerm;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields?.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      });
    }

    return this;
  }

  filter() {
    const queryObj = { ...this.query };
    const excludedQueries = ['email', 'sort', 'limit', 'page', 'fields'];
    excludedQueries.forEach((element) => delete queryObj[element]);
    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);

    return this;
  }

  sort() {
    const sort =
      (this?.query?.sort as string)?.split(',').join(' ') || '-createdAt';
    this.modelQuery = this.modelQuery.sort(sort as string);

    return this;
  }

  paginate() {
    const page = Number(this?.query?.page) || 1;
    let limit = Number(this?.query?.limit) || 10;
    const skip = (page - 1) * limit;
    if (Number(this?.query?.limit) === 0) {
      limit = 0;
    }
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  fieldFilter() {
    const fields =
      (this?.query?.fields as string)?.split(',').join(' ') || '-__v';
    this.modelQuery = this.modelQuery.select(fields);

    return this;
  }

  async count() {
    const allFilters = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(allFilters);
    const page = Number(this?.query?.page) || 1;
    let limit = Number(this?.query?.limit) || 10;
    if (Number(this?.query?.limit) === 0) {
      limit = 0;
    }
    const totalPage = Math.ceil(limit / page);

    return {
      total,
      page,
      limit,
      totalPage,
    };
  }
}

export default QueryBuilder;
