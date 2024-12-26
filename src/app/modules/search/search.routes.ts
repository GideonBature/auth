import { Router } from 'express';
import { roleVerifier, zodValidator } from '../../../shared';
import { asyncHandler } from '../../../shared/helpers/asyncHandler';
import { SearchModules } from './search.modules';
import { searchInputZodSchema } from './search.validation';

const router = Router();
const searchModules = new SearchModules();
const { getSearchSuggestionsController, getSearchResultsController } =
    searchModules.searchControllers;

router.get(
    '/suggestions',
    roleVerifier('business'),
    zodValidator(searchInputZodSchema),
    asyncHandler(getSearchSuggestionsController.bind(searchModules))
);

router.get(
    '/results',
    roleVerifier('business'),
    zodValidator(searchInputZodSchema),
    asyncHandler(getSearchResultsController.bind(searchModules))
);

export const searchRoutes = router;
