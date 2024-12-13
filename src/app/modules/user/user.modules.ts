import { UserControllers } from './user.controllers';
import { UserServices } from './user.services';

export class UserModules {
    readonly userServices: UserServices;

    readonly userControllers: UserControllers;

    constructor() {
        this.userServices = new UserServices();
        this.userControllers = new UserControllers(this.userServices);
    }
}
