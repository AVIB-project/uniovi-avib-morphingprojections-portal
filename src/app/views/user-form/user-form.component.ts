import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit { 
    projects: any[] = [];

    constructor(private router: Router) { }

    ngOnInit() {
    }

    onSaveUser() {
        this.router.navigate(['app/user-form'])
    }
}