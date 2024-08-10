import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/user.model';

@Component({
    templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit { 
    languages: any[] = [];
    userId: String;
    user: User;
    
    constructor(private router: Router, private route: ActivatedRoute, private userService: UserService) { }

    ngOnInit(): void {
        this.languages = [
            {name: 'Spanish', code: 'ES'},
            {name: 'English', code: 'US'}
        ]; 

        this.route.params.subscribe(params => {
            this.userId = params['id'];

            if (this.userId) {
                this.userService.loadUserById(this.userId)
                    .subscribe((user: User) => {
                        this.user = user;
                });
            }
        });        
    }

    onCreateUser() {
        this.router.navigate(['app/user'])
    }
}