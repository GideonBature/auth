import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { responseHandler } from '../../../shared';
import { FeedbackServices } from './feedback.services';
import { TFeedbackInput } from './feedback.types';

export class FeedbackControllers {
    constructor(readonly feedbackServices: FeedbackServices) {}

    async createFeedback(req: Request, res: Response): Promise<void> {
        const result = await this.feedbackServices.createFeedback(req.body as TFeedbackInput);

        responseHandler<object>(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: 'feedback created successfully!',
            data: result,
        });
    }
}
