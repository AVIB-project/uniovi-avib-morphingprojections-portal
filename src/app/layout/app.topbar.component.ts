import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, AbstractControlOptions, Validators, ValidationErrors, ValidatorFn, FormBuilder } from '@angular/forms';

import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';

import { NgEventBus, MetaData } from 'ng-event-bus';

import { OrganizationFormComponent } from '../views/organization-form/organization-form.component';

import { AuthService } from '../shared/services/auth.service';
import { ContextService } from '../shared/services/context.service';
import { UserService } from '../shared/services/user.service';
import { OrganizationService } from '../shared/services/organization.service';

import { Organization } from '../shared/models/organization.model';
import { Project } from '../shared/models/project.model';
import { Case } from '../shared/models/case.model';
import { Resource } from '../shared/models/resource.model';
import { UserCase } from '../shared/models/user-case.model';

import { ResourceTypeEnum } from '../shared/enum/resource-type.enum';
import { EventType } from '../shared/enum/event-type.enum';
interface ProjectItem {
    projectId: string;
    label: string;
    value?: string;
    items: any[],
}

interface CaseItem {
    label: string;
    value: Case;
}

export const PasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmpassword = control.get('confirmPassword');
    
    if(password && confirmpassword && password.value != confirmpassword.value) {
        return {
            passwordNoMatch:  true
        }
    }

    return null;
};
@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    providers: [DialogService, ConfirmationService]
})
export class AppTopBarComponent implements OnInit { 
    eventType = EventType;
    subscriptionEvents: any; 
    subscriptionAddProjectEvents: any; 
    subscriptionEditProjectEvents: any; 
    subscriptionRemoveProjectEvents: any; 
    subscriptionAddCaseEvents: any; 
    subscriptionEditCaseEvents: any; 
    subscriptionRemoveCaseEvents: any; 

    @ViewChild('searchinput')
    searchInput!: ElementRef;
    @ViewChild('menubutton')
    menuButton!: ElementRef;
    searchActive: boolean = false;
    menu: MenuItem[] = [];
 
    userDetails: any = {};
    user: any = {};
    userCase: UserCase; 
    organizations: Organization[];
    selectedOrganization: Organization;
    projects: Project[];
    projectList: ProjectItem[];    
    selectedProject: ProjectItem | null;    
    cases: Case[];
    selectedCase: Case | null;      
    menuOrganizationitems: MenuItem[] = [];
    
    resourceTypeEnum = ResourceTypeEnum;    
    resetPasswordViewVisible: boolean = false;
    
    resetPasswordFormGroup = this.fb.group(
        {
            password: ['', Validators.required],
            confirmPassword: [],
        },
        {
            validators: PasswordValidator
        } as AbstractControlOptions
    );
    
    constructor(private router: Router, private fb: FormBuilder,
        private authService: AuthService, private confirmationService: ConfirmationService, 
        private eventBus: NgEventBus, public layoutService: LayoutService, private dialogService: DialogService,
        public contextService: ContextService, private userService: UserService, private organizationService: OrganizationService) {
        this.menuOrganizationitems = [
            {
                label: 'Organization', items: [
                    { label: 'Add', icon: 'pi pi-plus', command: () => this.addOrganization() },
                    { label: 'Edit', icon: 'pi pi-check', command: () => this.editOrganization() },
                    { label: 'Remove', icon: 'pi pi-trash', command: () => this.removeOrganization() }
                ]
            }
        ]    
        
        // get user details
        this.loadUserDetails();
    }

    ngOnInit() {
        this.subscriptionAddProjectEvents = this.eventBus.on(this.eventType.APP_ADD_PROJECT)
            .subscribe((meta: MetaData) => {                
                const selectProjectItem = { projectId: meta.data.projectId, label: meta.data.name, value: meta.data.description, items: [] };
                
                this.projectList = [selectProjectItem, ...this.projectList];
            });
        
        this.subscriptionEditProjectEvents = this.eventBus.on(this.eventType.APP_EDIT_PROJECT)
            .subscribe((meta: MetaData) => {     
                const projectItem: ProjectItem = this.projectList.find((projectItem: ProjectItem) => projectItem.projectId == meta.data.projectId);

                if (projectItem) {
                    projectItem.label = meta.data.name;
                }
            });
        
        this.subscriptionRemoveProjectEvents = this.eventBus.on(this.eventType.APP_DELETE_PROJECT)
            .subscribe((meta: MetaData) => {      
                this.projectList = this.projectList.filter((projectItem) => projectItem.label != meta.data.name );            
            });
        
        this.subscriptionAddCaseEvents = this.eventBus.on(this.eventType.APP_ADD_CASE)
            .subscribe((meta: MetaData) => {                
                /*const caseItem: CaseItem = {
                    label: meta.data.name, value: {
                        caseId: meta.data.caseId, name: meta.data.name, description: meta.data.description, type: "PRIVATE", resources: []
                    }
                };

                const result = this.projectList.map((projectItem: ProjectItem) => {
                    if (projectItem.projectId === meta.data.projectId) {
                        return { ...projectItem, items: [caseItem, ...projectItem.items] };
                    } else {
                        return projectItem;
                    }
                });

                this.projectList = result;*/

                this.getUserCases();
            });
        
        this.subscriptionEditCaseEvents = this.eventBus.on(this.eventType.APP_EDIT_CASE)
            .subscribe((meta: MetaData) => {
                /*const projectItem: ProjectItem = this.projectList.find((projectItem: ProjectItem) => {
                    if (projectItem.projectId == meta.data.projectId)
                        return projectItem;
                    
                    return null;
                });

                if (projectItem) {
                    const caseItem: CaseItem = projectItem.items.find((caseItem: CaseItem) => {
                        if (caseItem.value.caseId == meta.data.caseId)
                            return caseItem;
                    
                        return null;
                    });

                    if (caseItem) {
                        caseItem.label = meta.data.name;
                        caseItem.value.name = meta.data.name;
                        caseItem.value.description = meta.data.description;  
                    }

                    this.selectedCase = caseItem.value;
                }*/
                
                this.getUserCases();
            });
        
        this.subscriptionRemoveCaseEvents = this.eventBus.on(this.eventType.APP_DELETE_CASE)
            .subscribe((meta: MetaData) => {                
                this.getUserCases();
            });         
    }
    
    private addOrganization() {
        const organizationFormRef = this.dialogService.open(OrganizationFormComponent, {
            data: {
                organization: null
            },
            header: 'Add Organization Form',
            width: '50%',
            styleClass: 'organization-form',
        });

        organizationFormRef.onClose.subscribe((result: any) => {
            if (result && result.action == 'save') {
                this.organizationService.saveOrganization(result.data)
                    .subscribe((id: String) => {
                        this.getUserCases();

                        /*this.eventBus.cast(this.eventType.MESSAGE, {severity: this.eventSeverity.INFO,
                            tittle: this.translateService.instant('MACHINE_VIEW.MESSAGE_TITLE_UPDATE'),
                            message: this.translateService.instant('MACHINE_VIEW.MESSAGE_DETAIL_UPDATE', {mid: machine.data.mid})});*/
                    });
            }        
        });        
    }

    private editOrganization() {
        const machineFormRef = this.dialogService.open(OrganizationFormComponent, {
            data: {
                organization: this.selectedOrganization
            },
            header: 'Edit Organization Form',
            width: '50%',
            styleClass: 'organization-form',
        });

        machineFormRef.onClose.subscribe((result: any) => {
            if (result && result.action == 'save') {
                this.organizationService.saveOrganization(result.data)
                    .subscribe((id: String) => {
                        // refresh organizations
                        this.getUserCases();

                        // emit a event for change
                        this.onChangeCase();
                            
                        /*this.eventBus.cast(this.eventType.MESSAGE, {severity: this.eventSeverity.INFO,
                            tittle: this.translateService.instant('MACHINE_VIEW.MESSAGE_TITLE_UPDATE'),
                            message: this.translateService.instant('MACHINE_VIEW.MESSAGE_DETAIL_UPDATE', {mid: machine.data.mid})});*/
                    });
            }        
        });  
    }

    private removeOrganization() {
        this.confirmationService.confirm({
            //target: event.target as EventTarget,
            message: 'Are you sure that you want to proceed?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon:"none",
            rejectIcon:"none",
            rejectButtonStyleClass:"p-button-text",
            accept: () => {
                if (this.selectedOrganization) {
                    this.organizationService.deleteOrganization(this.selectedOrganization.organizationId)
                        .subscribe(() => {
                            this.getUserCases();                            
                        });
                }
            }
        });
    }
    
    private loadUserDetails() {
        // get user details from iam
        this.userDetails = this.authService.getLoggedUser();

        // if we want not reload again we must recover the cases from externalId not userId because
        // when recover the userId the request not finalize and user can be undefined!!!
        /*this.user = this.contextService.getContext().user;

        this.getUserCases();*/

        // get user metadata from system 
        this.userService.getUserByEmail(this.userDetails.email)
            .subscribe({
                next: user => {
                    this.user = user;  

                    // load user cases
                    this.getUserCases(); 
                },
                error: error => {
                    console.error(error.message);
                }
        });
    }
    
    private loadCasesByOrganization() {
        // parse projects list to bind to component
        this.projectList = [];

        this.selectedOrganization.projects.forEach((project: Project) => {
            let projectItem: ProjectItem = { projectId: project.projectId, label: project.name, value: project.description, items: [] };

            this.projectList.push(projectItem);

            project.cases.forEach((_case: Case) => {
                let caseItem: CaseItem = { label: _case.name, value: _case };
                
                projectItem.items.push(caseItem)
            });              
        }); 
        
        if (this.projectList.length > 0 && this.projectList[0].items.length > 0) {
            this.selectedProject = this.projectList[0];
            this.selectedCase = this.projectList[0].items[0].value;
        } else {
            this.selectedProject = null;
            this.selectedCase = null;
        }   

        // refresh indices
        this.onChangeCase();
    }
    
    private getUserCases() {
        this.userService.getUserCases(this.user.userId)
            .subscribe({
                next: userCase => {
                    this.userCase = userCase;

                    this.organizations = userCase.organizations;

                    if (this.organizations.length > 0) {            
                        this.selectedOrganization = this.organizations[0];
                        
                        // parse projects list to bind to component
                        this.loadCasesByOrganization();

                        // initialize context service with default organization and case selected
                        this.selectedOrganization = this.organizations[0];
                        
                        this.onChangeCase();                                    
                    }       
                },
                error: error => {
                    console.error(error.message);
                }
            });
    }
    
    get layoutTheme(): string {
        return this.layoutService.config().layoutTheme;
    }

    get colorScheme(): string {
        return this.layoutService.config().colorScheme;
    }

    get logo(): string {
        /*const path = 'assets/layout/images/logo-';
        const logo = (this.layoutTheme === 'primaryColor'  && !(this.layoutService.config().theme  == "yellow")) ? 'light.png' : (this.colorScheme === 'light' ? 'dark.png' : 'light.png');
        return path + logo;*/

        return 'assets/layout/images/gsdpi_logo.png';
    }

    get tabs(): MenuItem[] {
        return this.layoutService.tabs;
    }
    
    onChangeCase() {
        // context organizations selectd
        this.contextService.getContext().organizationId = this.selectedOrganization.organizationId;

        // context project selectd
        if ( this.selectedProject)
            this.contextService.getContext().projectId = this.selectedProject.projectId;        
        else
            this.contextService.getContext().projectId = null;        
        
        // context case and resources selectd
        if (this.selectedCase) {
            this.contextService.getContext().caseId = this.selectedCase.caseId;

            this.contextService.getContext().bucketDataMatrix = this.selectedCase.resources.find((resource: Resource) => resource.type == this.resourceTypeEnum.DATAMATRIX)?.bucket!;
            this.contextService.getContext().fileDataMatrix = this.selectedCase.resources.find((resource: Resource) => resource.type == this.resourceTypeEnum.DATAMATRIX)?.file!;
            this.contextService.getContext().bucketSampleAnnotation = this.selectedCase.resources.find((resource: Resource) => resource.type == this.resourceTypeEnum.SAMPLE_ANNOTATION)?.bucket!;
            this.contextService.getContext().fileSampleAnnotation = this.selectedCase.resources.find((resource: Resource) => resource.type == this.resourceTypeEnum.SAMPLE_ANNOTATION)?.file!;
            this.contextService.getContext().bucketAttributeAnnotation = this.selectedCase.resources.find((resource: Resource) => resource.type == this.resourceTypeEnum.ATTRIBUTE_ANNOTATION)?.bucket!;
            this.contextService.getContext().fileAttributeAnnotation = this.selectedCase.resources.find((resource: Resource) => resource.type == this.resourceTypeEnum.ATTRIBUTE_ANNOTATION)?.file!;
            this.contextService.getContext().bucketSampleProjection = this.selectedCase.resources.find((resource: Resource) => resource.type == this.resourceTypeEnum.PRIMAL_PROJECTION)?.bucket!;
            this.contextService.getContext().fileSampleProjection = this.selectedCase.resources.find((resource: Resource) => resource.type == this.resourceTypeEnum.PRIMAL_PROJECTION)?.file!;
            this.contextService.getContext().bucketAttributeProjection = this.selectedCase.resources.find((resource: Resource) => resource.type == this.resourceTypeEnum.DUAL_PROJECTION)?.bucket!;
            this.contextService.getContext().fileAttributeProjection = this.selectedCase.resources.find((resource: Resource) => resource.type == this.resourceTypeEnum.DUAL_PROJECTION)?.file!;            
        }
        else {
            this.contextService.getContext().caseId = null;

            this.contextService.getContext().bucketDataMatrix = null;
            this.contextService.getContext().fileDataMatrix = null;
            this.contextService.getContext().bucketSampleAnnotation = null;
            this.contextService.getContext().fileSampleAnnotation = null;
            this.contextService.getContext().bucketAttributeAnnotation = null;
            this.contextService.getContext().fileAttributeAnnotation = null;
            this.contextService.getContext().bucketSampleProjection = null;
            this.contextService.getContext().fileSampleProjection = null;
            this.contextService.getContext().bucketAttributeProjection = null;
            this.contextService.getContext().fileAttributeProjection = null;
        }
        
        // publish change case event type
        this.eventBus.cast(this.eventType.APP_SELECT_CONTEXT, this.contextService.getContext());
    }
    
    onChangeOrganization() {
        // load cases grouped by project
        this.loadCasesByOrganization();    
    }
    
    onMenuButtonClick() {
        this.layoutService.onMenuToggle();
    }

    onActivateSearch() {
        this.searchActive = true;
        setTimeout(() => {
            this.searchInput.nativeElement.focus();
        }, 100);
    }

    onDeactivateSearch() {
        this.searchActive = false;
    }

    onRemoveTab(event: MouseEvent, item: MenuItem, index: number) {
        this.layoutService.onTabClose(item, index);
        event.preventDefault();
    }
        
    onProfile(event: any) {
        //this.router.navigate(['/user-form', { id: this.user.userId }]);
        this.router.navigate(['/user-form', { id: this.user.externalId }]);
    }

    onShowResetPassword(event: any) {
        this.resetPasswordViewVisible = true;
    }

    onResetPassword(event: any) {
        this.resetPasswordViewVisible = false;

        if (this.resetPasswordFormGroup.value.password) {
            this.userService.resetPassword(this.user.userId, this.resetPasswordFormGroup.value.password)
                .subscribe({
                    error: error => {
                        console.error(error.message);
                    }
                });
        }
    }
    
    onLogout(event: any) {
        this.authService.logout();
    }

    ngOnDestroy(): void {
        if(this.subscriptionEvents)
            this.subscriptionEvents.unsubscribe();

        if(this.subscriptionAddProjectEvents)
            this.subscriptionAddProjectEvents.unsubscribe();
        
        if(this.subscriptionEditProjectEvents)
            this.subscriptionEditProjectEvents.unsubscribe();
        
        if(this.subscriptionRemoveProjectEvents)
            this.subscriptionRemoveProjectEvents.unsubscribe();
        
        if(this.subscriptionAddCaseEvents)
            this.subscriptionAddCaseEvents.unsubscribe();
        
        if(this.subscriptionEditCaseEvents)
            this.subscriptionEditCaseEvents.unsubscribe();
        
        if(this.subscriptionRemoveCaseEvents)
            this.subscriptionRemoveCaseEvents.unsubscribe();     
    }    
}
