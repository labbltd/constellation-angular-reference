import { Component, OnInit } from '@angular/core';
import { BootstrapCaseType, TokenInfo } from '@labb/constellation-core-types';
import { BootstrapService, OAuth2Service, PContainer } from '@labb/dx-engine';
import { config } from './embed-config';

@Component({
  selector: 'dx-case',
  template: `
    <header>
      <a href="/" (click)="$event.preventDefault(); showCaseList = true">
        <img src="/angular.gif" alt="Show case types">
      </a>
    </header>
    <main>
      @if (showCaseList) {
        <section>
          <h2>Start a new case</h2>
          <menu>
            @for (caseType of caseList; track caseType.pyWorkTypeImplementationClassName) {
              <li>
                <button type="button" (click)="createCase(caseType.pyWorkTypeImplementationClassName)">
                  {{caseType.pyWorkTypeName}}
                </button>
              </li>
            }
          </menu>
        </section>
      }
      @if (container) {
        <ng-container dxContainer [container]="container"/>
      }
    </main>
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
        clientId: config.clientId!,
        pkce: config.pkce!,
        authService: config.authService!,
        accessTokenUrl: config.accessTokenUrl!,
        authorizationUrl: config.authUrl!,
        redirectUrl: config.redirectUrl!,
        appId: config.appId!
      } : {
        accessTokenUrl: config.accessTokenUrl!,
        clientId: config.clientId!,
        clientSecret: config.clientSecret!,
        appId: config.appId!
      };
    token = config.clientId ?
      config.authUrl ?
        await OAuth2Service.getTokenAuthorizationCode(authConfig) :
        await OAuth2Service.getTokenCredentials(authConfig)
      : {} as TokenInfo;

    this.container = await BootstrapService.init({
      appID: config.appId,
      infinityServer: config.infinityServer,
      token: token!,
      localeID: config.localeId
    });
    this.caseList = window.PCore.getEnvironmentInfo().getCaseTypeList() as unknown as BootstrapCaseType[] ?? [];
    if (config.action === 'createCase') {
      await window.PCore.getMashupApi().createCase(config.caseTypeId!, 'app', { pageName: config.casePage! });
      this.showCaseList = false;
    } else if (config.action === 'openCase') {
      await window.PCore.getMashupApi().openCase(config.caseId!, 'app', { pageName: config.casePage! });
      this.showCaseList = false;
    } else if (config.action === 'openAssignment') {
      await window.PCore.getMashupApi().openAssignment(config.assignmentId!, 'app', { pageName: config.casePage! });
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

