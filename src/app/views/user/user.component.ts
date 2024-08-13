import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Table } from 'primeng/table';

import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/user.model';
@Component({
    templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {
    users: User[];

    constructor(private userService: UserService, private router: Router) { }

    ngOnInit() {
        this.userService.loadUsersByOrganizationId("65cd021098d02623c46da92d")
            .subscribe((users: User[]) => {
                this.users = users;
            });
    }

    onGlobalFilterCase(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains')
    }

    toggleOptions(event: Event, opt: HTMLElement, date: HTMLElement) {
        if (event.type === 'mouseenter') {
            opt.style.display = 'flex';
            date.style.display = 'none';
        } else {
            opt.style.display = 'none';
            date.style.display = 'flex';
        }
    }
 
    onAddUser(event: Event) {
        this.router.navigate(['app/user-form'])
    }

    onUpdateUser(event: Event, user: User) {
        event.preventDefault();

        console.log(user.userId);

        //this.router.navigate(['app/user-form', { id: user.userId }])
    }

    onRemoveUser(event: Event, user: User) {
        event.preventDefault();
        
        console.log(user.userId);

        //this.router.navigate(['app/user-form', { id: this.selectedUser.userId }])
    }
}