import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

import { AuthService } from '../shared/services/auth.service';
import { ContextService } from '../shared/services/context.service';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    styleUrls: ['app.menu.component.scss'],
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService, private contextService: ContextService, private authService: AuthService) { }

    private configureMenuByRole() {
        if (this.authService.getRoles().includes("ADMIN")) {
            this.model = [
                {
                label: 'Dashboard',
                icon: 'pi pi-home',
                routerLink: ['/']
                },
                {
                    label: 'Cases',
                    icon: 'pi pi-sitemap',
                    routerLink: ['/case']               
                },            
                {
                    label: 'Annotations',
                    icon: 'pi pi-bookmark',
                    routerLink: ['/configuration'],               
                },
                {
                    label: 'Resources',
                    icon: 'pi pi-fw pi-database',
                    routerLink: ['/ingestion'],
                },
                {
                    label: 'Jobs',
                    icon: 'pi pi-fw pi-cog',
                    routerLink: ['/encoding'],
                },         
                {
                    label: 'Projections',
                    icon: 'pi pi-fw pi-eye',
                    routerLink: ['/projection']               
                },
                {
                    label: 'Users',
                    icon: 'pi pi-fw pi-users',
                    routerLink: ['/user']
                },
            ];
        } else if (this.authService.getRoles().includes("USER")) {
           this.model = [
                {
                label: 'Dashboard',
                icon: 'pi pi-home',
                routerLink: ['/']
                },
                {
                    label: 'Cases',
                    icon: 'pi pi-sitemap',
                    routerLink: ['/case']               
                },            
                {
                    label: 'Annotations',
                    icon: 'pi pi-cog',
                    routerLink: ['/configuration'],               
                },
                {
                    label: 'Resources',
                    icon: 'pi pi-fw pi-database',
                    routerLink: ['/ingestion'],
                },
                {
                    label: 'Jobs',
                    icon: 'pi pi-fw pi-cog',
                    routerLink: ['/encoding'],
                },         
                {
                    label: 'Projections',
                    icon: 'pi pi-fw pi-eye',
                    routerLink: ['/projection']               
                },
                {
                    label: 'Users',
                    icon: 'pi pi-fw pi-users',
                    routerLink: ['/user']
                },
            ];
        } else {
           this.model = [
                {
                    label: 'Dashboard',
                    icon: 'pi pi-home',
                    routerLink: ['/']
                },        
                {
                    label: 'Projection',
                    icon: 'pi pi-fw pi-eye',
                    routerLink: ['/projection']               
                },
                {
                    label: 'Users',
                    icon: 'pi pi-fw pi-users',
                    routerLink: ['/user']
                },
            ];
        }
    }

    ngOnInit() {
        this.configureMenuByRole();       
    }
}
