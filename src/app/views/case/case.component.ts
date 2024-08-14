import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Table } from 'primeng/table';

import { ContextService } from '../../shared/services/context.service';
import { OrganizationService } from '../../shared/services/organization.service';
import { OrganizationCase } from '../../shared/models/organization-case.model';

@Component({
    templateUrl: './case.component.html'
})
export class CaseComponent implements OnInit {
    organizationCases: OrganizationCase[];
    
    constructor(
        private router: Router,
        private contextService: ContextService, private organizationService: OrganizationService) { 
    
    }

    ngOnInit() {
        this.organizationService.getCasesByUser(this.contextService.getContext().user.userId)
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

    onAddCase() {
        this.router.navigate(['/case-form'])
    }
}