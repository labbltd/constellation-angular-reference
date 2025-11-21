import { Component, OnInit } from '@angular/core';
import { OAuth2Service } from '@labb/dx-engine';
import { config } from './embed-config';

@Component({
  selector: 'dx-case',
  template: `
    @if (config.token) {
      <dx-pega-entry
        [caseID]="config.action === 'openCase' ? config.caseId : ''"
        [caseTypeID]="config.action === 'createCase' ? config.caseTypeId : ''"
        [assignmentID]="config.assignmentId || ''"
        [infinityServer]="config.infinityServer"
        localeID="en-US"
        [appID]="config.appId || ''"
        [token]="config.token"></dx-pega-entry>
    }
    @if (!config.token && !config.authError) { <h1>Authentication in progress</h1> }
    @if (config.authError) { <h1>{{config.authError}}</h1> }
  `,
  standalone: false
})
export class PegaCaseComponent implements OnInit {
  public config: any = {};

  async ngOnInit(): Promise<void> {
    this.config = await this.getConfig() as any;
  }

  async getConfig() {
    try {
      return {
        ...config,
        token: config.authUrl ?
          await OAuth2Service.getTokenAuthorizationCode({
            clientId: config.clientId,
            pkce: config.pkce,
            authService: config.authService,
            accessTokenUrl: config.accessTokenUrl!,
            authorizationUrl: config.authUrl,
            redirectUrl: config.redirectUrl,
            appId: config.appId
          }) :
          await OAuth2Service.getTokenCredentials({
            accessTokenUrl: config.accessTokenUrl,
            clientId: config.clientId,
            clientSecret: config.clientSecret,
            appId: config.appId
          })
      }
    } catch (e) {
      return {
        ...config,
        authError: e
      }
    }
  }
}

