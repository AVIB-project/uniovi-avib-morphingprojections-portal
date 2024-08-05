import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    templateUrl: './case.component.html'
})
export class CaseComponent implements OnInit { 
    projects: any[] = [];

    constructor(private router: Router) { }

    ngOnInit() {
        console.log("Case View");
    }

    onSaveCase() {
        this.router.navigate(['app/organization'])
    }
}