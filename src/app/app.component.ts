import { Component, OnInit } from '@angular/core';

import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';

import { PrimeNGConfig } from 'primeng/api';

import { LayoutService, AppConfig } from './layout/service/app.layout.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    public isLoggedIn = false;
    public userProfile: KeycloakProfile | null = null;
    
    constructor(
        private readonly keycloak: KeycloakService,
        private primengConfig: PrimeNGConfig, private layoutService: LayoutService) { }

    async ngOnInit() {
        this.primengConfig.ripple = true;

        // set this theme attributes by default:
        // - menuMode: slim-plus
        // - colorScheme: dark
        const config: AppConfig = {
            ripple: false,                      //toggles ripple on and off
            inputStyle: 'outlined',             //default style for input elements
            menuMode: 'slim-plus',              //layout mode of the menu, valid values are "static", "overlay", "slim", and "slim-plus"
            colorScheme: 'dark',                //color scheme of the template, valid values are "light", "dim" and "dark"
            theme: 'indigo',                    //default component theme for PrimeNG, see theme section for available values  
            layoutTheme: 'colorScheme',         //theme of the layout, see layout theme section for available values  
            scale: 14                           //size of the body font size to scale the whole application
        };
        
        this.layoutService.config.set(config);
        
        this.isLoggedIn = await this.keycloak.isLoggedIn();

        if (this.isLoggedIn) {
            this.userProfile = await this.keycloak.loadUserProfile();
        }        
    }
}

