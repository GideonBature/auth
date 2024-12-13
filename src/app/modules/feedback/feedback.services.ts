/* eslint-disable class-methods-use-this */
import { Feedback } from '@prisma/client';
import httpStatus from 'http-status';
import { errorNames, HandleApiError, prisma } from '../../../shared';
import { TFeedbackInput } from './feedback.types';

export class FeedbackServices {
    createFeedback = async (input: TFeedbackInput): Promise<Feedback | null> => {
        const { email, message, name } = input;

        if (!email.trim() || !message.trim() || !name.trim()) {
            throw new HandleApiError(
                errorNames.CONFLICT,
                httpStatus.CONFLICT,
                'Email, message, and name are required.'
            );
        }

        const feedbackCountToday = await prisma.feedback.count({
            where: {
                email,
                createdAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    lt: new Date(new Date().setHours(23, 59, 59, 999)),
                },
            },
        });

        if (feedbackCountToday >= 2) {
            throw new HandleApiError(
                errorNames.CONFLICT,
                httpStatus.CONFLICT,
                'You can only send up to 2 feedbacks per day.'
            );
        }

        const createdFeedback = await prisma.feedback.create({
            data: {
                email,
                message,
                name,
            },
        });

        return createdFeedback;
    };
}
