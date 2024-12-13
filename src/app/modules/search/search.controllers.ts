import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { responseHandler } from '../../../shared';
import { SearchServices } from './search.services';

export class SearchControllers {
    constructor(readonly searchServices: SearchServices) {}

    async getSearchSuggestionsController(req: Request, res: Response): Promise<void> {
        const searchTerm = req.query.searchTerm as string;
        const result = await this.searchServices.getSearchSuggestionsService(searchTerm);

        responseHandler<object>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Search suggestions retrieved successfully',
            data: result,
        });
    }

    async getSearchResultsController(req: Request, res: Response): Promise<void> {
        const searchTerm = req.query.searchTerm as string;
        const userId = req.user?.id as string;
        const result = await this.searchServices.getSearchResultsServices(searchTerm, userId);

        responseHandler<object>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Search results retrieved successfully',
            data: result,
        });
    }

    async getPopularSearch(req: Request, res: Response): Promise<void> {
        const userId = req.user?.id as string;
        const result = await this.searchServices.getPopularSearches(userId);

        responseHandler<object>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Popular Search retrieved successfully',
            data: result,
        });
    }

    async getRecentSearch(req: Request, res: Response): Promise<void> {
        const userId = req.user?.id as string;
        const result = await this.searchServices.getRecentSearches(userId);

        responseHandler<object>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Recent Search retrieved successfully',
            data: result,
        });
    }
}
