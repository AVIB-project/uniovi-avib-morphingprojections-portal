import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Table } from 'primeng/table';

import { ContextService } from '../../shared/services/context.service';
import { OrganizationService } from '../../shared/services/organization.service';
import { OrganizationCase } from '../../shared/models/organization-case.model';

@Component({
    templateUrl: './ingestion.component.html'
})
export class IngestionComponent implements OnInit {
    organizationCases: OrganizationCase[];
    
    constructor(
        private router: Router,
        private organizationService: OrganizationService, private contextService: ContextService) { 
    }

    ngOnInit() {
    }

    onGlobalFilterCase(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains')
    }

    onAddCase(){
        this.router.navigate(['/case-form'])
    }
}