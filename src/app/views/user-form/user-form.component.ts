import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit { 
    languages: any[] = [];
    projects: any[] = [];

    constructor(private router: Router) { }

    ngOnInit() {
        this.languages = [
            {name: 'Spanish', code: 'ES'},
            {name: 'English', code: 'US'}
        ]; 
    }

    onCreateUser() {
        this.router.navigate(['app/user'])
    }
}