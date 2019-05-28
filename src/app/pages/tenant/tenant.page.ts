import { Component, AfterContentInit } from '@angular/core';
import { Events } from '@ionic/angular';
import { AuthGuardService } from '../../services/auth-route-guard';
import { AmplifyService } from 'aws-amplify-angular';
import Amplify, { Analytics } from 'aws-amplify';


@Component({
  selector: 'app-page-home',
  templateUrl: 'tenant.page.html',
  styleUrls: ['tenant.page.scss']
})
export class TenantPage implements AfterContentInit {

  authState: any;
  // including AuthGuardService here so that it's available to listen to auth events
  authService: AuthGuardService;
  amplifyService: AmplifyService;
  private tenantInfo: any;

  constructor(
    public events: Events,
    public guard: AuthGuardService,
    public amplify: AmplifyService
  ) {
    this.authState = {loggedIn: false};
    this.authService = guard;
    this.amplifyService = amplify;
    this.amplifyService.authStateChange$
    .subscribe(authState => {
      this.authState.loggedIn = authState.state === 'signedIn';
      this.events.publish('data:AuthState', this.authState);
    });
  }

  ngAfterContentInit() {
    this.events.publish('data:AuthState', this.authState);
    this.amplifyService.api().get('apv', `/idp/naberconsultingdevelopers`, {}).then((res) => {
      if (!res) {
        console.log('no res available to log');
      } else {
        console.log(JSON.stringify(res));
        this.tenantInfo = JSON.stringify(res);
        Amplify.configure({
          Auth: {
            mandatorySignIn: true,
            region: res.region,
            userPoolId: res.id_userpool,
            identityPoolId: res.id_pool,
            userPoolWebClientId: res.id_client
          },
          Storage: {
            region: '',
            bucket: '',
            identityPoolId: ''
          },
          API: {
            endpoints: [
              {
                name: 'apv',
                endpoint: 'https://817klbu9si.execute-api.us-east-1.amazonaws.com/DEV',
                region: 'us-east-1'
              },
            ]
          }
        });
      }
    }).catch((err) => {
          console.log('Error getting list:', err);
    });
  }
}
