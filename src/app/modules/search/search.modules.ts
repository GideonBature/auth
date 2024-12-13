import { SearchControllers } from './search.controllers';
import { SearchServices } from './search.services';

export class SearchModules {
    readonly searchServices: SearchServices;

    readonly searchControllers: SearchControllers;

    constructor() {
        this.searchServices = new SearchServices();
        this.searchControllers = new SearchControllers(this.searchServices);
    }
}
