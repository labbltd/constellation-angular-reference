import { Component } from '@angular/core';
import { TokenInfo } from '@labb/constellation-core-types';
import { LoggerService } from '@labb/dx-engine';

@Component({
  selector: 'dx-portal',
  template: `
    <dx-pega-entry
            portal="WebPortal"
            [infinityServer]="infinityServer"
            [deployUrl]="deployUrl"
            [token]="token"></dx-pega-entry>
  `,
  standalone: false
})
export class PegaPortalComponent {
  public authError!: string;
  public infinityServer!: string;
  public deployUrl = 'http://localhost:4201/';
  public token = {} as TokenInfo;
  
  public constructor() {
    LoggerService.enabled = true;
    // this.infinityServer = 'https://labbconsulting05.pegalabs.io/prweb';
    this.infinityServer = 'http://localhost:3333/prweb';
  }
}
