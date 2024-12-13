export type TGenericErrorMessage = {
    path: string | number;
    message: string;
};

export type TGenericErrorResponse = {
    error: string;
    statusCode: number;
    errorName: string;
    errorMessages: TGenericErrorMessage[];
};
