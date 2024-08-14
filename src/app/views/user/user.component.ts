import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Table } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';

import { NgEventBus, MetaData } from 'ng-event-bus';

import { ContextService } from '../../shared/services/context.service';
import { UserService } from '../../shared/services/user.service';

import { EventType } from '../../shared/enum/event-type.enum';
import { User } from '../../shared/models/user.model';
@Component({
    templateUrl: './user.component.html',
    providers: [ConfirmationService]
})
export class UserComponent implements OnInit {
    subscriptionEvents: any; 
    eventType = EventType;
    users: User[];

    constructor(
        private confirmationService: ConfirmationService, private router: Router, private eventBus: NgEventBus,
        private contextService: ContextService, private userService: UserService) {         
    }

    private loadUsersByOrganizationId(organizationId: string) {
        this.userService.loadUsersByOrganizationId(organizationId)
            .subscribe((users: User[]) => {
                this.users = users;
            });
    }

    ngOnInit() {
        this.subscriptionEvents = this.eventBus.on(this.eventType.APP_CHANGE_CASE)
            .subscribe((meta: MetaData) => {
                if (meta.data.organizationId) {
                    this.loadUsersByOrganizationId(meta.data.organizationId);
                }
        });
        
        if (this.contextService.getContext().organizationId) {
            this.loadUsersByOrganizationId(this.contextService.getContext().organizationId);
        }
    }

    onGlobalFilterCase(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains')
    }

    onToggleOptions(event: Event, opt: HTMLElement, date: HTMLElement) {
        if (event.type === 'mouseenter') {
            opt.style.display = 'flex';
            date.style.display = 'none';
        } else {
            opt.style.display = 'none';
            date.style.display = 'flex';
        }
    }
 
    onAddUser(event: Event) {
        this.router.navigate(['/user-form'])
    }

    onUpdateUser(event: Event, user: User) {
        this.router.navigate(['/user-form', { id: user.userId }])
    }

    onRemoveUser(event: Event, user: User) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure that you want to proceed?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon:"none",
            rejectIcon:"none",
            rejectButtonStyleClass:"p-button-text",
            accept: () => {
                if (user.userId) {
                    this.userService.deleteUser(user.userId)
                        .subscribe(() => {
                            if (this.contextService.getContext().organizationId) {
                                this.loadUsersByOrganizationId(this.contextService.getContext().organizationId);
                            }                            
                        });
                }
            }
        });
    }

    ngOnDestroy(): void {
        if(this.subscriptionEvents)
            this.subscriptionEvents.unsubscribe();
    }    
}