import { ChatControllers } from './chat.controllers';
import { ChatServices } from './chat.services';

export class ChatModules {
    readonly chatServices: ChatServices;

    readonly chatControllers: ChatControllers;

    constructor() {
        this.chatServices = new ChatServices();
        this.chatControllers = new ChatControllers(this.chatServices);
    }
}
