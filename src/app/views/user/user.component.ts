import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Table } from 'primeng/table';

import { OrganizationService } from '../../shared/services/organization.service';
import { OrganizationCase } from '../../shared/models/organization-case';

@Component({
    templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {
    organizationCases: OrganizationCase[];
    
    constructor(private organizationService: OrganizationService, private router: Router) { }

    ngOnInit() {
        this.organizationService.getCasesByUser("66a90828bfb5b24be6ab8210")
            .subscribe({
                next: (organizationCases: OrganizationCase[]) => {
                    this.organizationCases = organizationCases;      
                },
                error: error => {
                    console.error(error.message);
                }
            });
    }

    onGlobalFilterCase(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains')
    }

    onAddUser(){
        this.router.navigate(['app/user-form'])
    }
}