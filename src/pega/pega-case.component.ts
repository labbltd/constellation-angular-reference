import { Component, OnInit } from '@angular/core';
import { BootstrapCaseType, TokenInfo } from '@labb/constellation-core-types';
import { BootstrapService, OAuth2Service, PContainer } from '@labb/dx-engine';
import { config } from './embed-config';

@Component({
  selector: 'dx-case',
  template: `
    <img height="50px" src="/angular.gif" (click)="showCaseList = true;">
    @if (container) {
      <ng-container dxContainer [container]="container"/>
    }
    @if (showCaseList) {
      <ul>
      @for (caseType of caseList; track caseType.pyWorkTypeImplementationClassName) {
        <li>
          <a (click)="createCase(caseType.pyWorkTypeImplementationClassName)">
            {{caseType.pyWorkTypeName}}
          </a>
        </li>
      } 
    </ul>
    }
  `,
  standalone: false
})
export class PegaCaseComponent implements OnInit {
  public container!: PContainer;
  public showCaseList!: boolean;
  public caseList!: BootstrapCaseType[];

  async ngOnInit(): Promise<void> {
    let token: TokenInfo;
    const authConfig = config.authUrl ?
      {
        clientId: config.clientId,
        pkce: config.pkce,
        authService: config.authService,
        accessTokenUrl: config.accessTokenUrl,
        authorizationUrl: config.authUrl,
        redirectUrl: config.redirectUrl,
        appId: config.appId
      } : {
        accessTokenUrl: config.accessTokenUrl,
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        appId: config.appId
      };
    token = config.authUrl ?
      await OAuth2Service.getTokenAuthorizationCode(authConfig) :
      await OAuth2Service.getTokenCredentials(authConfig);

      this.container = await BootstrapService.init({
      appID: config.appId,
      infinityServer: config.infinityServer,
      token: token!
    });
    this.caseList = window.PCore.getEnvironmentInfo().environmentInfoObject?.pyCaseTypeList ?? [];
    if (config.action === 'createCase') {
      await window.PCore.getMashupApi().createCase(config.caseTypeId);
      this.showCaseList = false;
    } else if (config.action === 'openCase') {
      await window.PCore.getMashupApi().openCase(config.caseId);
      this.showCaseList = false;
    } else {
      this.showCaseList = true;
    }
  }

  public async createCase(caseType: string) {
    await window.PCore.getMashupApi().createCase(caseType);
    this.showCaseList = false;
  }
}

