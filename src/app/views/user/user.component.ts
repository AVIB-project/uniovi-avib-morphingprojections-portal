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
            .subscribe(users => {
                this.users = users;
            });
    }

    onGlobalFilterCase(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains')
    }

    onAddUser() {
        this.router.navigate(['app/user-form'])
    }
}