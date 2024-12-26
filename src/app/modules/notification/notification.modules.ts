import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.services';

export class NotificationModules {
    readonly notificationService: NotificationService;

    readonly notificationControllers: NotificationController;

    constructor() {
        this.notificationService = new NotificationService();
        this.notificationControllers = new NotificationController(this.notificationService);
    }
}
