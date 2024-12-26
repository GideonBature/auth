import { Router } from 'express';
import { zodValidator } from '../../../shared';
import { asyncHandler } from '../../../shared/helpers/asyncHandler';
import { FeedbackModules } from './feedback.modules';
import { feedbackInputZodSchema } from './feedback.validation';

const router = Router();
const feedbackModules = new FeedbackModules();
const { createFeedback } = feedbackModules.feedbackControllers;

router.post(
    '/create-feedback',
    zodValidator(feedbackInputZodSchema),
    asyncHandler(createFeedback.bind(feedbackModules))
);

export const feedbackRoutes = router;
