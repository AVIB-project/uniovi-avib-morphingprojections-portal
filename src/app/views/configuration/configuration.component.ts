import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Table } from 'primeng/table';

@Component({
    templateUrl: './configuration.component.html'
})
export class ConfigurationComponent implements OnInit { 
    organizationCases: any[];
    
    constructor(private router: Router) { }

    ngOnInit() {
       
    }

    onGlobalFilterCase(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains')
    }

    onAddConfiguration(){
        this.router.navigate(['app/configuration-form'])
    }
}