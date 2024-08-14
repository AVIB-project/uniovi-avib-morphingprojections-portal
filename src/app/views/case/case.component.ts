import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Table } from 'primeng/table';
import { MenuItem } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

import { ContextService } from '../../shared/services/context.service';
import { OrganizationService } from '../../shared/services/organization.service';
import { OrganizationCase } from '../../shared/models/organization-case.model';

import { Case } from '../../shared/models/case.model';
@Component({
    templateUrl: 'case.component.html',
    styleUrls: ['case.component.scss'],
    providers: [ConfirmationService]
})
export class CaseComponent implements OnInit {
    organizationCases: OrganizationCase[];
    items: MenuItem[] | undefined;

    constructor(
        private confirmationService: ConfirmationService, private router: Router,
        private contextService: ContextService, private organizationService: OrganizationService) { 
    }

    private loadCasesByUser(userId: string) {
        this.organizationService.getCasesByUser(userId)
            .subscribe({
                next: (organizationCases: OrganizationCase[]) => {
                    this.organizationCases = organizationCases;      
                },
                error: error => {
                    console.error(error.message);
                }
            });
    }

    ngOnInit() {
        this.items = [
            { label: 'Edit Case', icon: 'pi pi-pencil' },
            { label: 'Remove Case', icon: 'pi pi-trash' }
        ];
        
        this.loadCasesByUser(this.contextService.getContext().user.userId);
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
    
    onAddCase(event: Event) {
        this.router.navigate(['/case-form']);
    }

    onUpdateCase(event: Event, organizationCase: OrganizationCase) {
        this.router.navigate(['/case-form', { id: organizationCase.caseId }])
    }

    onRemoveCase(event: Event, organizationCase: OrganizationCase) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure that you want to proceed?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon:"none",
            rejectIcon:"none",
            rejectButtonStyleClass:"p-button-text",
            accept: () => {
                if (organizationCase.caseId) {
                    /*this.organizationService.deleteCase(organizationCase.caseId)
                        .subscribe(() => {
                            if (this.contextService.getContext().organizationId) {
                                this.loadCasesByUser(this.contextService.getContext().organizationId);
                            }                            
                        });*/
                }
            }
        });
    }
}