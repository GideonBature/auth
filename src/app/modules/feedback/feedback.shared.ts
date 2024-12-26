/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/require-await */
import { Feedback } from '@prisma/client';
import { prisma } from '../../../shared';

export class FeedbackSharedServices {
    static async findFeedbacksByEmail(email: string): Promise<Feedback[] | []> {
        return prisma.feedback.findMany({
            where: { email },
        });
    }
}
