import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/app.layout.module';

import { OrganizationFormModule } from './views/organization-form/organization-form.module'

import { NgEventBus } from 'ng-event-bus'

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
        config: {
            url: 'http://localhost:8088',
            realm: 'avib',
            clientId: 'portal-cli'
        },
        initOptions: {
            onLoad: 'check-sso',
            silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html'
        }
    });
}

@NgModule({
    imports: [
        AppLayoutModule,
        AppRoutingModule,
        BrowserModule,
        KeycloakAngularModule,
        //OrganizationFormModule
    ],
    declarations: [
        AppComponent,
    ],
    providers: [
        {
            provide: LocationStrategy,
            useClass: HashLocationStrategy
        },
        {
            provide: APP_INITIALIZER,
            useFactory: initializeKeycloak,
            multi: true,
            deps: [KeycloakService]
        },
        NgEventBus
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
