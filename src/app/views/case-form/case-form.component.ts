import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormBuilder } from '@angular/forms';

import { NgEventBus, MetaData } from 'ng-event-bus';

import { ContextService } from '../../shared/services/context.service';
import { ProjectService } from '../../shared/services/project.service';
import { CaseService } from '../../shared/services/case.service';

import { Project } from '../../shared/models/project.model';
import { EventType } from '../../shared/enum/event-type.enum';
import { CaseTypeEnum } from '../../shared/enum/case-type.enum';

@Component({
    templateUrl: './case-form.component.html'
})
export class CaseFormComponent implements OnInit { 
    subscriptionEvents: any;
    eventType = EventType;
    
    caseFormGroup = this.fb.group({
        caseId: [null],
        projectId: ['', Validators.required],
        name: ['', Validators.required],
        description: [''],
        type: [CaseTypeEnum.Private, Validators.required],
        active: [true, Validators.required]
    });
    
    caseId: String;
    projects: Project[] = [];

    constructor(
        private router: Router, private route: ActivatedRoute,
        private fb: FormBuilder, private eventBus: NgEventBus,
        private contextService: ContextService,
        private projectService: ProjectService, private caseService: CaseService) {         
    }

    ngOnInit() {
        this.caseFormGroup.controls.projectId.setValue(this.contextService.getContext().projectId);
        
        this.route.params.subscribe(params => {
            this.caseId = params['id'];

            if (this.caseId) {                
                this.caseService.loadCaseById(this.caseId)
                    .subscribe((_case: any) => {
                        console.log(_case);

                        if (_case) {
                            this.caseFormGroup.setValue(_case);
                        }
                });
            }
        });
        
        this.subscriptionEvents = this.eventBus.on(this.eventType.APP_CHANGE_CASE)
            .subscribe((meta: MetaData) => {
                this.caseFormGroup.controls.projectId.setValue(meta.data.projectId);

                this.getProjectsByOrganization(this.contextService.getContext().organizationId);
            });     
        
        if (this.contextService.getContext().organizationId) {
            this.getProjectsByOrganization(this.contextService.getContext().organizationId);
        }
    }

    private getProjectsByOrganization(organizationId: String) {
        this.projectService.loadProjectsByOrganizationId(organizationId)
            .subscribe((projects: Project[]) => {
                this.projects = projects;
            });
    }    

    onCancelCase(event: any) {
        
        this.router.navigate(['/case'])
    }
    
    onAddCase(event: any) {
        console.log(this.caseFormGroup.value);

        /*this.projectService.saveUser(this.caseFormGroup.value)
            .subscribe((caseId: any) => {
                console.log(caseId);

                this.router.navigate(['/case']);
        });*/
    }
    
    ngOnDestroy(): void {
        if(this.subscriptionEvents)
            this.subscriptionEvents.unsubscribe();
    }    
}