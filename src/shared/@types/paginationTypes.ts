export type TPaginationOptions = {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: string;
};

export type TPaginationResult = TPaginationOptions & {
    skip: number;
};
export type TSortConditions = {
    [key: string]: string;
};
