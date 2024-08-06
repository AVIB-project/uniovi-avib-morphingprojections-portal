import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    templateUrl: './configuration-form.component.html'
})
export class ConfigurationFormComponent implements OnInit { 
    projects: any[] = [];

    constructor(private router: Router) { }

    ngOnInit() {        
    }

    onCreateConfiguration() {
        this.router.navigate(['app/configuration'])
    }
}