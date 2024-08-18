import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormBuilder } from '@angular/forms';

import { MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

import { NgEventBus, MetaData } from 'ng-event-bus';

import { ProjectFormComponent } from '../project-form/project-form.component';

import { ContextService } from '../../shared/services/context.service';
import { ProjectService } from '../../shared/services/project.service';
import { CaseService } from '../../shared/services/case.service';

import { Project } from '../../shared/models/project.model';
import { EventType } from '../../shared/enum/event-type.enum';
import { CaseTypeEnum } from '../../shared/enum/case-type.enum';

@Component({
    templateUrl: './case-form.component.html',
    providers: [DialogService]
})
export class CaseFormComponent implements OnInit { 
    subscriptionEvents: any;
    eventType = EventType;
    caseId: String;
    projects: Project[] = [];
    menuProjectitems: MenuItem[] = [];
    
    caseFormGroup = this.fb.group({
        caseId: [null],
        organizationId: ['', Validators.required],        
        projectId: ['', Validators.required],                
        name: ['', Validators.required],
        description: [''],
        type: [CaseTypeEnum.Private, Validators.required]
    });
    
    constructor(
        private router: Router, private route: ActivatedRoute,
        private fb: FormBuilder, private eventBus: NgEventBus,
        private contextService: ContextService,
        private projectService: ProjectService, private caseService: CaseService, private dialogService: DialogService,) {         
    }
        
    private addProject() {
        const projectFormRef = this.dialogService.open(ProjectFormComponent, {
            data: {
                project: null
            },
            header: 'Project Form',
            width: '50%',
            styleClass: 'project-form',
        });

        projectFormRef.onClose.subscribe((result: any) => {
            if (result && result.action == 'save') {
                /*this.organizationService.save(result.data)
                    .subscribe((machine: any) => {
                        this.getMachines(this.event);

                        this.eventBus.cast(this.eventType.MESSAGE, {severity: this.eventSeverity.INFO,
                            tittle: this.translateService.instant('MACHINE_VIEW.MESSAGE_TITLE_UPDATE'),
                            message: this.translateService.instant('MACHINE_VIEW.MESSAGE_DETAIL_UPDATE', {mid: machine.data.mid})});
                        },
                    (error: any) => {
                        console.log(error);

                        //this.eventBus.cast(this.eventType.MESSAGE, {severity: this.eventSeverity.ERROR, tittle: 'Machines Update', error: err.error.errors});
                });*/
            }        
        });  
    }

    private editProject() {
        const project = this.projects.find((project: any) => project.projectId == this.caseFormGroup.controls.projectId.value);
        

        const projectFormRef = this.dialogService.open(ProjectFormComponent, {
            data: {
                project: project
            },
            header: 'Project Form',
            width: '50%',
            styleClass: 'project-form',
        });

        projectFormRef.onClose.subscribe((result: any) => {
            if (result && result.action == 'save') {
                /*this.organizationService.save(result.data)
                    .subscribe((machine: any) => {
                        this.getMachines(this.event);

                        this.eventBus.cast(this.eventType.MESSAGE, {severity: this.eventSeverity.INFO,
                            tittle: this.translateService.instant('MACHINE_VIEW.MESSAGE_TITLE_UPDATE'),
                            message: this.translateService.instant('MACHINE_VIEW.MESSAGE_DETAIL_UPDATE', {mid: machine.data.mid})});
                        },
                    (error: any) => {
                        console.log(error);

                        //this.eventBus.cast(this.eventType.MESSAGE, {severity: this.eventSeverity.ERROR, tittle: 'Machines Update', error: err.error.errors});
                });*/
            }        
        });
    }

    private removeProject() {
        console.log("Remove project: " + this.caseFormGroup.controls.projectId);
    }
    
    ngOnInit() {
        this.menuProjectitems = [
            {
                label: 'Project', items: [
                    { label: 'Add', icon: 'pi pi-plus', command: () => this.addProject() },
                    { label: 'Edit', icon: 'pi pi-check', command: () => this.editProject() },
                    { label: 'Remove', icon: 'pi pi-trash', command: () => this.removeProject() }
                ]
            }
        ]
        
        this.caseFormGroup.controls.projectId.setValue(this.contextService.getContext().projectId);
        
        this.route.params.subscribe(params => {
            this.caseId = params['id'];

            if (this.caseId) {                
                this.caseService.getCaseById(this.caseId)
                    .subscribe({
                        next: (_case: any) => {
                            console.log(_case);

                            if (_case) {
                                this.caseFormGroup.setValue(_case);
                            }  
                        },
                        error: error => {
                            console.error(error.message);
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
        this.projectService.getProjectsByOrganizationId(organizationId)
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