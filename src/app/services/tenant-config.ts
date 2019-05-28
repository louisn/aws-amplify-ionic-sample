import { Injectable } from '@angular/core';
import Amplify, { Analytics } from 'aws-amplify';

@Injectable()
export class TenantConfig {


    constructor() {
    }

    public configureAmplify(config) {
        Amplify.configure(config);
        console.log(Amplify.Auth);
    }

}
