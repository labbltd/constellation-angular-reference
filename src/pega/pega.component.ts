import { Component } from '@angular/core';
import { TokenInfo } from '@typescale/constellation-core-types';
import { OAuth2Service } from '@typescale/dx-engine';

@Component({
  selector: 'dx-case',
  template: `
    <dx-pega-entry *ngIf="token"
            caseTypeID="ATHO-Insurance-Work-LeningBerekenen"
            [infinityServer]="infinityServer"
            [token]="token"></dx-pega-entry>
  `
})
export class PegaComponent {
  public token!: TokenInfo;
  public infinityServer!: string;

  public constructor() {
    this.infinityServer = 'http://localhost:3333/prweb';
    OAuth2Service.getTokenCredentials({
      serverUrl: this.infinityServer,
      clientId: '45946986569480875840',
      clientSecret: '17CA02A7E811F063861884214028D54D'
    }).then(token => {
      this.token = token;
    });
  }
}
