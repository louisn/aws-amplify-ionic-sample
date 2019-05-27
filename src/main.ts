import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import Amplify, { Analytics } from 'aws-amplify';
// import aws_exports from './aws-exports';

// Amplify.configure(aws_exports);

// Auth configured for NABER users
// TODO set the configuration dynamically for multi-tenant SaaS
/** These commands obtain the tenant information from the aws CLI
 * cognito-identity --profile DevOpsServerless list-identity-pools --max-results 50
 * cognito-idp --profile DevOpsServerless list-user-pool-clients --user-pool-id us-east-1_QiLjC77MM
 * cognito-idp --profile DevOpsServerless list-user-pools --max-results 50
*/
Amplify.configure({
  Auth: {
    mandatorySignIn: true,
        region: 'us-east-1',
        userPoolId: 'us-east-1_QiLjC77MM',
        identityPoolId: 'us-east-1:6c65e17a-6c86-445e-9958-6a8b156a6d65',
        userPoolWebClientId: '4onrn29c8jts4o7ros3ssvh6vq'
  },
  Storage: {
    region: '',
        bucket: '',
        identityPoolId: ''
  },
  API: {
    endpoints: [
      {
        name: 'notes',
        endpoint: '',
        region: 'us-east-1'
      },
    ]
  }
});
if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
