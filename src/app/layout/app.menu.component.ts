import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
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
    }
}
