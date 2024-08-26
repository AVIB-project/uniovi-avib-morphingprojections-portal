import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

import { AuthService } from '../shared/services/auth.service';
import { ContextService } from '../shared/services/context.service';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
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
                    label: 'Case',
                    icon: 'pi pi-sitemap',
                    routerLink: ['/case']               
                },            
                {
                    label: 'Annotation',
                    icon: 'pi pi-cog',
                    routerLink: ['/configuration'],               
                },
                {
                    label: 'Ingestion',
                    icon: 'pi pi-fw pi-database',
                    routerLink: ['/ingestion'],
                },
                {
                    label: 'Encoding',
                    icon: 'pi pi-fw pi-sliders-v',
                    routerLink: ['/encoding'],
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
        } else if (this.authService.getRoles().includes("USER")) {
           this.model = [
                {
                label: 'Dashboard',
                icon: 'pi pi-home',
                routerLink: ['/']
                },
                {
                    label: 'Case Management',
                    icon: 'pi pi-sitemap',
                    routerLink: ['/case']               
                },            
                {
                    label: 'Case Configuration',
                    icon: 'pi pi-cog',
                    routerLink: ['/configuration'],               
                },
                {
                    label: 'Ingestion',
                    icon: 'pi pi-fw pi-database',
                    routerLink: ['/ingestion'],
                },
                {
                    label: 'Encodings',
                    icon: 'pi pi-fw pi-sliders-v',
                    routerLink: ['/encoding'],
                },         
                {
                    label: 'Morphing Projection',
                    icon: 'pi pi-fw pi-eye',
                    routerLink: ['/projection']               
                },
                {
                    label: 'User Management',
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
                    label: 'Morphing Projection',
                    icon: 'pi pi-fw pi-eye',
                    routerLink: ['/projection']               
                },
                {
                    label: 'User Management',
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
