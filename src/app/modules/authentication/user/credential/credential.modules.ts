import { CredentialControllers } from './credential.controller';
import { CredentialServices } from './credential.services';

export class CredentialModules {
    readonly credentialServices: CredentialServices;

    readonly credentialControllers: CredentialControllers;

    constructor() {
        this.credentialServices = new CredentialServices();
        this.credentialControllers = new CredentialControllers(this.credentialServices);
    }
}
