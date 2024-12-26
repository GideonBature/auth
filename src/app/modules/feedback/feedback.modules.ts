import { FeedbackControllers } from './feedback.controllers';
import { FeedbackServices } from './feedback.services';

export class FeedbackModules {
    readonly feedbackServices: FeedbackServices;

    readonly feedbackControllers: FeedbackControllers;

    constructor() {
        this.feedbackServices = new FeedbackServices();
        this.feedbackControllers = new FeedbackControllers(this.feedbackServices);
    }
}
