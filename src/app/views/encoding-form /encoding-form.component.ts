import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ContextService } from '../../shared/services/context.service';
import { JobService } from '../../shared/services/job.service';

import { Job } from '../../shared/models/job.model';

@Component({
    templateUrl: './encoding-form.component.html',
})
export class EncodingFormComponent implements OnInit { 
    jobName: String;
    jobLogs: string[];
    jobFilterLogs: string[];

    constructor(
        private router: Router, private route: ActivatedRoute,
        private jobService: JobService,
        private contextService: ContextService,) {         
    }            
    
    private getJobLogs() {
        this.jobService.getJobLogs(this.jobName)
            .subscribe((jobLogs: any) => {
                let logs: string[] = jobLogs.log.split("\n");
                        
                this.jobLogs = logs;
                this.jobFilterLogs = logs;
        });
    }

    ngOnInit() { 
        this.route.params.subscribe(params => {
            this.jobName = params['name'];

            if (this.jobName) {
                this.getJobLogs();
            }
        });
    }

    onGlobalFilterJobs(event: Event) {
        let filterValue: string = (event.target as HTMLInputElement).value;

        let filtered = this.jobLogs.filter((str: string) => {
            return str.includes(filterValue);
        });

        this.jobFilterLogs = filtered;
    }
    
    onRefreshLog(event: Event) {
        this.getJobLogs();
    }
    
    onCloseResource(event: Event) {
        this.router.navigate(['/encoding']);
    }  
}