import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Table } from 'primeng/table';
import { MenuItem, ConfirmationService } from 'primeng/api';

import { NgEventBus, MetaData } from 'ng-event-bus';

import { EventType } from '../../shared/enum/event-type.enum';
import { ContextService } from '../../shared/services/context.service';
import { OrganizationService } from '../../shared/services/organization.service';
import { CaseService } from '../../shared/services/case.service';
import { JobService } from '../../shared/services/job.service';

import { OrganizationCase } from '../../shared/models/organization-case.model';
import { JobSubmit } from '../../shared/models/job-submit.model';

@Component({
    templateUrl: 'case.component.html',
    styleUrls: ['case.component.scss'],
    providers: [ConfirmationService]
})
export class CaseComponent implements OnInit {
    subscriptionEvents: any; 
    eventType = EventType;
    
    organizationCases: OrganizationCase[];
    items: MenuItem[] | undefined;

    private loadCasesByUser(organizationId: string, userId: string) {
        this.organizationService.getCasesByOrganizationAndUser(organizationId, userId)
            .subscribe({
                next: (organizationCases: OrganizationCase[]) => {
                    this.organizationCases = organizationCases;      
                },
                error: error => {
                    console.error(error.message);
                }
            });
    }
    
    constructor(
        private confirmationService: ConfirmationService, private router: Router, private eventBus: NgEventBus,
        private contextService: ContextService, private organizationService: OrganizationService, private caseService: CaseService, private jobService: JobService) { 
    }

    ngOnInit() {
        this.items = [
            { label: 'Edit Case', icon: 'pi pi-pencil' },
            { label: 'Remove Case', icon: 'pi pi-trash' }
        ];
        
        // From case selector item
        this.subscriptionEvents = this.eventBus.on(this.eventType.APP_SELECT_CONTEXT)
            .subscribe((meta: MetaData) => {
                if (meta.data.organizationId) {
                    this.loadCasesByUser(meta.data.organizationId, meta.data.user.userId);
                }
            });
        
        // From menu item
        if (this.contextService.getContext().organizationId && this.contextService.getContext().user.userId) {
            this.loadCasesByUser(this.contextService.getContext().organizationId, this.contextService.getContext().user.userId);
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
    
    onAddCase(event: Event) {
        this.router.navigate(['/case-form']);
    }

    onEditCase(event: Event, organizationCase: OrganizationCase) {
        this.router.navigate(['/case-form', { id: organizationCase.caseId }])
    }

    onEncodingCase(event: Event, organizationCase: OrganizationCase) {
            this.confirmationService.confirm({
                target: event.target as EventTarget,
                message: 'Are you sure that you want to encoding?',
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                acceptIcon:"none",
                rejectIcon:"none",
                rejectButtonStyleClass: "p-button-text",
                defaultFocus: 'reject',
                accept: () => {
                    if (organizationCase.caseId) {
                        // create parameters entity
                        const parameters = {};
                        parameters["case_id"] = organizationCase.caseId;
                        //parameters["space"] = "primal,dual";
                        parameters["space"] = "primal"; // TODO: Only calculated primal projection
                        
                        // create job submit entity
                        const jobSubmit: JobSubmit = {
                            caseId: organizationCase.caseId,
                            parameters: parameters
                        };

                        this.jobService.submitJob(jobSubmit)
                            .subscribe(() => {
                                this.router.navigate(['/encoding', { id: organizationCase.caseId }])
                        });
                    }
                }
        });
    }
    
    onRemoveCase(event: Event, organizationCase: OrganizationCase) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure that you want to proceed?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon:"none",
            rejectIcon:"none",
            rejectButtonStyleClass: "p-button-text",
            defaultFocus: 'reject',
            accept: () => {
                if (organizationCase.caseId) {
                    this.caseService.deleteCase(organizationCase.caseId)
                        .subscribe(() => {
                            this.loadCasesByUser(this.contextService.getContext().organizationId, this.contextService.getContext().user.userId);

                            // emit a delete case event
                            this.eventBus.cast(this.eventType.APP_DELETE_CASE, organizationCase);
                    });
                }
            }
        });
    }

    onRefreshCases(event: Event) {
        this.loadCasesByUser(this.contextService.getContext().organizationId, this.contextService.getContext().user.userId);
    }
    
    ngOnDestroy(): void {
        if(this.subscriptionEvents)
            this.subscriptionEvents.unsubscribe();
    }     
}