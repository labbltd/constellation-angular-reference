import { Component } from '@angular/core';
import { TokenInfo } from '@labb/constellation-core-types';
import { OAuth2Service } from '@labb/dx-engine';

@Component({
  selector: 'dx-case',
  template: `
    @if (token) {
      <dx-pega-entry
            caseTypeID="ATHO-Insurance-Work-LeningBerekenen"
            [infinityServer]="infinityServer"
            [deployUrl]="deployUrl"
            [token]="token"></dx-pega-entry>
    }
  `,
  standalone: false
})
export class PegaComponent {
  public token!: TokenInfo;
  public infinityServer!: string;
  public deployUrl = window.location.origin;

  public constructor() {
    this.infinityServer = 'http://localhost:3333/prweb';
    OAuth2Service.getTokenAuthorizationCode({
      authorizationUrl: `${this.infinityServer}/PRRestService/oauth2/v1/authorize`,
      accessTokenUrl: `${this.infinityServer}/PRRestService/oauth2/v1/token`,
      deployUrl: this.deployUrl,
      clientId: '11680909344524843879',
      clientSecret: '769E32F2200BCBF7241827FD98D4F22E'
    }).then(token => {
      this.token = token;
    });
  }
}
