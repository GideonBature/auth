export const searchFilterCalculator = (
    searchTerm: string | undefined,
    SearchableFields: string[],
    filtersData: { [key: string]: string | number | boolean }
): object[] => {
    console.log('🌼 🔥🔥 file: searchAndFilter.ts:6 🔥🔥 filtersData🌼', filtersData);

    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: SearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }

    // if (Object.keys(filtersData).length > 0) {
    //   andConditions.push({
    //     AND: Object.keys(filtersData).map((key) => ({
    //       [key]: {
    //         equals: filtersData[key],
    //       },
    //     })),
    //   });
    // }
    if (Object.keys(filtersData).length > 0) {
        andConditions.push({
            AND: Object.keys(filtersData).map((key) => {
                if (key === 'category') {
                    return {
                        categoryId: {
                            equals: filtersData[key],
                        },
                    };
                }
                if (key === 'maxPrice' || key === 'minPrice') {
                    const operator = key === 'maxPrice' ? 'lte' : 'gte';
                    const stringPrice = filtersData[key] as string;
                    return {
                        price: {
                            [operator]: parseFloat(stringPrice), // Convert value to a number
                        },
                    };
                }
                return {
                    [key]: {
                        equals: filtersData[key],
                    },
                };
            }),
        });
    }

    // if (Object.keys(filtersData).length) {
    //   andConditions.push(
    //     ...Object.entries(filtersData).map(([field, value]) => {
    //       if (field === 'maxPrice' || field === 'minPrice') {
    //         const operator = field === 'maxPrice' ? 'lte' : 'gte';
    //         return {
    //           price: {
    //             [operator]: value, // Convert value to a number
    //           },
    //         };
    //       }
    //       return {
    //         [field]: {
    //           contains: value, // Using 'contains' for case-insensitive partial matching
    //         },
    //       };
    //     })
    //   );
    // }

    return andConditions;
};
