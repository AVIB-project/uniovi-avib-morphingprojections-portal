import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Table } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';

import { NgEventBus, MetaData } from 'ng-event-bus';

import { ContextService } from '../../shared/services/context.service';
import { JobService } from '../../shared/services/job.service';

import { EventType } from '../../shared/enum/event-type.enum';
import { Job } from '../../shared/models/job.model';

@Component({
    templateUrl: './encoding.component.html',
    styleUrls: ['encoding.component.scss'],
    providers: [ConfirmationService]
})
export class EncodingComponent implements OnInit {
    subscriptionEvents: any; 
    eventType = EventType;
    
    jobs: Job[];
    
    constructor(
        private router: Router, private eventBus: NgEventBus, private confirmationService: ConfirmationService, 
        private jobService: JobService, private contextService: ContextService) { 
    }

    private loadJobs(caseId: string) {
        this.jobService.getAllByCaseId(caseId)
            .subscribe({
                next: (jobs: Job[]) => {
                    this.jobs = jobs;          
                },
                error: error => {
                    console.error(error.message);
                }
            });
    }
    
    ngOnInit() {
        // From case selector item
        this.subscriptionEvents = this.eventBus.on(this.eventType.APP_SELECT_CONTEXT)
            .subscribe((meta: MetaData) => {
                if (meta.data.caseId) {
                    this.loadJobs(meta.data.caseId);
                }
            });
        
        // From menu item
        if (this.contextService.getContext().caseId) {
            this.loadJobs(this.contextService.getContext().caseId);
        }        
    }

    getStateJob(state) {
        if (state == "Running")
            return "state-running";
        else if (state == "Succeeded")
            return "state-succeeded";
        else if (state == "Failed")
            return "state-failed";
        else
            return "state-indeterminate";
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
    
    onGlobalFilterCase(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains')
    }

    onRefreshJobs() {
        this.loadJobs(this.contextService.getContext().caseId);
    }

    onJobsLog(event: Event, job: Job) {
        this.router.navigate(['/encoding-form', { name: job.name }]);
    }
}