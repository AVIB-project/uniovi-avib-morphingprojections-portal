import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    templateUrl: './case-form-.component.html'
})
export class CaseFormComponent implements OnInit { 
    projects: any[] = [];

    constructor(private router: Router) { }

    ngOnInit() {
        console.log("Case View");
    }

    onSaveCase() {
        this.router.navigate(['app/organization'])
    }
}