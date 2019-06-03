import { Component, AfterContentInit } from '@angular/core';
import { Events } from '@ionic/angular';
import { AuthGuardService } from '../../services/auth-route-guard';
import { AmplifyService } from 'aws-amplify-angular';
import { Auth } from 'aws-amplify';
import Amplify, { Analytics } from 'aws-amplify';
// import { TenantConfig} from '../../services/tenant-config';


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

  onChanged(selection) {
    this.amplifyService.api().get('apv', '/idp/' + selection.detail.text, {}).then((res) => {
      if (!res) {
        console.log('no res available to log');
      } else {
        // console.log(JSON.stringify(res));
        this.tenantInfo = JSON.stringify(res);
        Amplify.configure({
          Auth: {
            tenantId: res.Item.id,
            mandatorySignIn: true,
            region: res.Item.region,
            userPoolId: res.Item.id_userpool,
            identityPoolId: res.Item.id_pool,
            userPoolWebClientId: res.Item.id_client
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
      console.log('Error getting identity pool information:', err);
    });

  }

  ngAfterContentInit() {
    this.events.publish('data:AuthState', this.authState);
  }

  getProfile() {
    console.log(Auth.currentSession());
    const authorization = this.amplifyService.auth()._config;
    const tenantId = authorization.tenantId ;
    this.amplifyService.api().get('apv', '/user/profile', {headers: {'Naber-Tenancy': `${tenantId}`}}).then((res) => {
      if (!res) {
        console.log('no response from /user/profile');
      } else {
        console.log(JSON.stringify(res));
      }
    }).catch((err) => {
      console.log(err);
    });
  }
}
