import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormBuilder, UntypedFormControl } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';

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
    providers: [DialogService, ConfirmationService]
})
export class CaseFormComponent implements OnInit { 
    subscriptionEvents: any;
    eventType = EventType;
    isEditMode: boolean = false;

    projects: Project[] = [];
    menuProjectitems: MenuItem[] = [];
    caseId: String;
    
    caseFormGroup = this.fb.group({
        caseId: [null],
        organizationId: [''],        
        projectId: new UntypedFormControl(''),                
        name: ['', Validators.required],
        description: [''],
        type: [CaseTypeEnum.Private, Validators.required]
    });
    
    private getProjectsByOrganization(organizationId: String) {
        this.projectService.getProjectsByOrganizationId(organizationId)
            .subscribe((projects: Project[]) => {
                this.projects = projects;
            });
    }   
    
    private addProject() {
        const projectFormRef = this.dialogService.open(ProjectFormComponent, {
            data: {
                project: null
            },
            header: 'Add Project Form',
            width: '50%',
            styleClass: 'project-form',
        });

        projectFormRef.onClose.subscribe((result: any) => {
            if (result && result.action == 'save') {
                this.projectService.saveProject(result.data)
                    .subscribe((projectId: String) => {
                        this.getProjectsByOrganization(this.contextService.getContext().organizationId);

                        // emit a project add event
                        this.eventBus.cast(this.eventType.APP_ADD_PROJECT, projectId);
                        
                        /*this.eventBus.cast(this.eventType.MESSAGE, {severity: this.eventSeverity.INFO,
                            tittle: this.translateService.instant('MACHINE_VIEW.MESSAGE_TITLE_UPDATE'),
                            message: this.translateService.instant('MACHINE_VIEW.MESSAGE_DETAIL_UPDATE', {mid: machine.data.mid})});*/
                    });
            }        
        });  
    }

    private editProject() {
        const project = this.projects.find((project: any) => project.projectId == this.caseFormGroup.controls.projectId.value);
        
        const projectFormRef = this.dialogService.open(ProjectFormComponent, {
            data: {
                project: project
            },
            header: 'Edit Project Form',
            width: '50%',
            styleClass: 'project-form',
        });

        projectFormRef.onClose.subscribe((result: any) => {
            if (result && result.action == 'save') {
                this.projectService.saveProject(result.data)
                    .subscribe((projectId: String) => {
                        this.getProjectsByOrganization(this.contextService.getContext().organizationId);

                        // emit a project edit event
                        this.eventBus.cast(this.eventType.APP_EDIT_PROJECT, projectId);
                        
                        /*this.eventBus.cast(this.eventType.MESSAGE, {severity: this.eventSeverity.INFO,
                            tittle: this.translateService.instant('MACHINE_VIEW.MESSAGE_TITLE_UPDATE'),
                            message: this.translateService.instant('MACHINE_VIEW.MESSAGE_DETAIL_UPDATE', {mid: machine.data.mid})});*/
                    });
            }        
        });
    }

    private removeProject() {
        const project = this.projects.find((project: any) => project.projectId == this.caseFormGroup.controls.projectId.value);

        this.confirmationService.confirm({
            message: 'Are you sure that you want to proceed?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon:"none",
            rejectIcon:"none",
            rejectButtonStyleClass:"p-button-text",
            accept: () => {
                if (this.caseFormGroup.controls.projectId.value) {
                    this.projectService.deleteProject(project.projectId)
                        .subscribe(() => {
                            this.getProjectsByOrganization(this.contextService.getContext().organizationId);

                            // emit a project delete event
                            this.eventBus.cast(this.eventType.APP_DELETE_PROJECT, project);
                        });
                }
            }
        });
        
        console.log("Remove project: " + this.caseFormGroup.controls.projectId);
    }
    
    constructor(
        private router: Router, private route: ActivatedRoute, private eventBus: NgEventBus,
        private fb: FormBuilder, private confirmationService: ConfirmationService, private dialogService: DialogService,
        private contextService: ContextService, private projectService: ProjectService, private caseService: CaseService) {         
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
                
        this.route.params.subscribe(params => {
            this.caseId = params['id'];

            if (this.caseId) {
                // form in edit mode
                this.isEditMode = true;

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
        
        this.subscriptionEvents = this.eventBus.on(this.eventType.APP_SELECT_CONTEXT)
            .subscribe((meta: MetaData) => {
                this.caseFormGroup.controls.projectId.setValue(meta.data.projectId);

                this.getProjectsByOrganization(this.contextService.getContext().organizationId);
            });     
        
        if (this.contextService.getContext().organizationId) {
            this.getProjectsByOrganization(this.contextService.getContext().organizationId);
        }

        if (this.contextService.getContext().projectId) {
            this.caseFormGroup.controls.projectId.setValue(this.contextService.getContext().projectId);
        }        
    }

    onCancelCase(event: Event) {
        this.router.navigate(['/case']);
    }
    
    onAddCase(event: Event) {        
        this.caseService.saveCase(this.caseFormGroup.value)
            .subscribe((_case: any) => {
                this.caseFormGroup.controls.caseId.setValue(_case.caseId);
                
                if (this.isEditMode)
                    // emit a edit case event
                    this.eventBus.cast(this.eventType.APP_EDIT_CASE, this.caseFormGroup.value);
                else
                    // emit a add case event
                    this.eventBus.cast(this.eventType.APP_ADD_CASE, this.caseFormGroup.value);
                
                // jump to master case
                this.router.navigate(['/case']);
            });
    }

    ngOnDestroy(): void {
        if(this.subscriptionEvents)
            this.subscriptionEvents.unsubscribe();
    }    
}