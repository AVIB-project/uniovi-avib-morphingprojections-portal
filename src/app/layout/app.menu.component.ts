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
                routerLink: ['/app/dashboard']
            },
            {
                label: 'Case Management',
                icon: 'pi pi-sitemap',
                routerLink: ['/app/case']               
            },            
            {
                label: 'Case Configuration',
                icon: 'pi pi-cog',
                routerLink: ['/app/configuration'],               
            },
            {
                label: 'Ingestion',
                icon: 'pi pi-fw pi-database',
                routerLink: ['/app/ingestion'],
            },
            {
                label: 'Encodings',
                icon: 'pi pi-fw pi-sliders-v',
                routerLink: ['/app/encoding'],
            },         
            {
                label: 'Morphing Projection',
                icon: 'pi pi-fw pi-eye',
                routerLink: ['/app/projection']               
            },
            {
                label: 'User Management',
                icon: 'pi pi-fw pi-user',
                routerLink: ['/app/user']
            },
        ];
    }
}
