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
    caseId: String;
    projects: Project[] = [];
    menuProjectitems: MenuItem[] = [];
    
    caseFormGroup = this.fb.group({
        caseId: [null],
        organizationId: [''],        
        projectId: new UntypedFormControl(''),                
        name: ['', Validators.required],
        description: [''],
        type: [CaseTypeEnum.Private, Validators.required]
    });
    
    constructor(
        private router: Router, private route: ActivatedRoute, private confirmationService: ConfirmationService,
        private fb: FormBuilder, private eventBus: NgEventBus,
        private contextService: ContextService,
        private projectService: ProjectService, private caseService: CaseService, private dialogService: DialogService,) {         
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
                    this.projectService.deleteProject(project?.projectId!)
                        .subscribe(() => {
                            this.getProjectsByOrganization(this.contextService.getContext().organizationId);
                        });
                }
            }
        });
        
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
        
        if (this.contextService.getContext().projectId) {
            this.caseFormGroup.controls.projectId.setValue(this.contextService.getContext().projectId);
        }
        
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
        this.router.navigate(['/case']);
    }
    
    onAddCase(event: any) {
        this.caseService.saveCase(this.caseFormGroup.value)
            .subscribe((caseId: any) => {
                console.log(caseId);

                this.router.navigate(['/case']);
            });
    }

    ngOnDestroy(): void {
        if(this.subscriptionEvents)
            this.subscriptionEvents.unsubscribe();
    }    
}