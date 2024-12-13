/* eslint-disable class-methods-use-this */
import { prisma } from '../../../shared';

export class SearchServices {
    async getSearchSuggestionsService(searchTerm: string): Promise<object> {
        const result = await prisma.lawyer.findMany({
            where: {
                OR: [
                    {
                        lawServices: {
                            contains: searchTerm,
                            mode: 'insensitive',
                        },
                    },
                    {
                        keywords: {
                            contains: searchTerm,
                            mode: 'insensitive',
                        },
                    },
                ],
            },
            select: {
                lawServices: true,
                keywords: true,
            },
        });
        return result;
    }

    async getSearchResultsServices(searchTerm: string, userId: string): Promise<object> {
        const result = await prisma.lawyer.findMany({
            where: {
                OR: [
                    {
                        lawServices: {
                            contains: searchTerm,
                            mode: 'insensitive',
                        },
                    },
                    {
                        keywords: {
                            contains: searchTerm,
                            mode: 'insensitive',
                        },
                    },
                ],
            },
            select: {
                id: true,
                lawServices: true,
                description: true,
                keywords: true,
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        phone: true,
                    },
                },
            },
        });

        await prisma.searchHistory.create({
            data: {
                userId,
                searchTerm,
            },
        });
        return result;
    }

    async getPopularSearches(userId: string): Promise<object> {
        return {};
    }

    async getRecentSearches(userId: string): Promise<object> {
        return {};
    }
}
