import { TPaginationOptions, TPaginationResult, TSortConditions } from '../@types';

export const paginationFields = ['page', 'limit', 'sortBy', 'sortOrder'];

export const calculatePagination = (options: Partial<TPaginationOptions>): TPaginationResult => {
    const page = Number(options.page || 1);
    const limit = Number(options.limit || 10);
    const skip = (page - 1) * limit;

    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder || 'desc';

    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder,
    };
};
export const sortConditionSetter = (
    sortBy: string | undefined,
    sortOrder: string | undefined
): TSortConditions => {
    const sortConditions: TSortConditions = {};

    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    return sortConditions;
};
