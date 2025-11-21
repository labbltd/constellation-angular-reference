export interface EmbedConfig {
    /**
     * needed for reference implementation and constellation
     */

    // pega instance
    infinityServer: string;

    // authorization scoping
    appId: string;

    // client registration information
    clientId: string;
    clientSecret: string;
    pkce: true,
    authService: string;
    accessTokenUrl: string;
    authUrl: string;
    revokeUrl: string;
    redirectUrl: string;

    // action=createCase
    caseTypeId: string;
    startingFields: Record<string, any> | undefined;
    
    // action=openCase
    caseId: string;
    
    // action=openAssignment
    assignmentId: string;
    
    // action=openPage
    pageId: string;
    className: string;

    // debug information
    xray: false,

    /**
     * needed for constellation only
     */

    // constellation design system location
    staticContentUrl: string;

    // authentication mechanism
    grantType: string; //authCode, customBearer, none, clientCreds, passwordCreds

    // which action to perform
    action: string; //openCase, createCase, getNextWork, openAssignment, openPage

    // what page to use for showing a case type
    casePage: string; //full, assignment, assignmentWithStages, simplifiedAssignment
    assignmentHeader: true,
    themeID: string;
    // https://docs.pega.com/bundle/platform/page/platform/user-experience/design-tokens-constellation.html
    theme: Record<string, any>;
}

export let config = {
    /**
     * needed for reference implementation and constellation
     */
    infinityServer: 'http://localhost:3333/prweb',
    accessTokenUrl: 'http://localhost:3333/prweb/PRRestService/oauth2/v1/token',

    // client registration information
    pkce: true,
    authService: 'pega',
    redirectUrl: 'http://localhost:4203/auth.html',

    // debug information
    xray: false,

    /**
     * needed for constellation only
     */
    action: 'createCase',
    caseTypeId: '<CaseTypeId>',

    // constellation design system location
    staticContentUrl: 'https://release.constellation.pega.io/8.24.52/react/prod/',

    // authentication mechanism
    grantType: 'clientCreds', //authCode, customBearer, none, clientCreds, passwordCreds

    // which action to perform

    // what page to use for showing a case type
    casePage: 'assignment', //full, assignment, assignmentWithStages, simplifiedAssignment
    assignmentHeader: true,

} as unknown as EmbedConfig;