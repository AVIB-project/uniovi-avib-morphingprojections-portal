import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';

import { Customer } from 'src/app/demo/api/customer';
import { CustomerService } from 'src/app/demo/service/customer.service';

import { OrganizationService } from '../../shared/services/organization.service';
import { OrganizationCase } from '../../shared/models/organization-case';

@Component({
    templateUrl: './organization.component.html'
})
export class OrganizationComponent implements OnInit {

    customers: Customer[] = [];
    organizationCases: OrganizationCase[];
    
    constructor(private customerService: CustomerService, private organizationService: OrganizationService, private router: Router) { }

    ngOnInit() {
        this.customerService.getCustomersLarge().then(customers => this.customers = customers);

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

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains')
    }

    onAddCase(){
        this.router.navigate(['profile/create'])
    }

}