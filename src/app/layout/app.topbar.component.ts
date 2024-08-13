import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";

import { NgEventBus } from 'ng-event-bus';

// app services, models and enumerations
import { ContextService } from '../shared/services/context.service';

import { UserService } from '../shared/services/user.service';
import { Organization } from '../shared/models/organization.model';
import { Project } from '../shared/models/project.model';
import { Case } from '../shared/models/case.model';
import { Resource } from '../shared/models/resource.model';
import { UserCase } from '../shared/models/user-case.model';

import { ResourceTypeEnum } from '../shared/enum/resource-type.enum';
import { EventType } from '../shared/enum/event-type.enum';
interface ProjectItem {
    id: string;
    label: string;
    value?: string;
    items: any[],
}
        
@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements AfterViewInit {
    @ViewChild('searchinput') searchInput!: ElementRef;
    @ViewChild('menubutton') menuButton!: ElementRef;
    searchActive: boolean = false;
    menu: MenuItem[] = [];

    readonly USER_ID = '66a90828bfb5b24be6ab8210';   // Administrator
    //readonly USER_ID = '66a908d7bfb5b24be6ab8211'; // Miguel Salinas User
    //readonly USER_ID = '66a90a0dbfb5b24be6ab8215'; // Abel Cuadrado User
    //readonly USER_ID = '66b63046bbf7692064417fd7'; // YYY User
    
    userCase: UserCase; 
    organizations: Organization[];
    selectedOrganization: Organization;
    projects: Project[];
    projectList: ProjectItem[];    
    selectedProject: ProjectItem;    
    cases: Case[];
    selectedCase: Case;      

    resourceTypeEnum = ResourceTypeEnum;
    eventType = EventType;

    constructor(private contextService: ContextService, private userService: UserService,
                private eventBus: NgEventBus, public layoutService: LayoutService) {
    }

    private loadCasesByOrganization() {
        // parse projects list to bind to component
        this.projectList = [];

        this.selectedOrganization.projects.forEach((project: Project) => {
            let projectItem: ProjectItem = { id: project.id, label: project.name, value: project.description, items: [] };

            this.projectList.push(projectItem);

            project.cases.forEach((cs: Case) => {
                let caseItem = { label: cs.name, value: cs };

                projectItem.items.push(caseItem)
            });              
        }); 
        
        if (this.projectList.length > 0 && this.projectList[0].items.length > 0) {
            this.selectedProject = this.projectList[0];
            this.selectedCase = this.projectList[0].items[0].value;

            // refresh indices
            this.onChangeCase();
        }    
    }
    
    private loadUserCases() {
        this.userService.loadUserCases(this.USER_ID)
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
    
    ngAfterViewInit() {
        // get user cases grouped by organization/project
        this.loadUserCases();      
    }

    onMenuButtonClick() {
        this.layoutService.onMenuToggle();
    }

    activateSearch() {
        this.searchActive = true;
        setTimeout(() => {
            this.searchInput.nativeElement.focus();
        }, 100);
    }

    deactivateSearch() {
        this.searchActive = false;
    }

    removeTab(event: MouseEvent, item: MenuItem, index: number) {
        this.layoutService.onTabClose(item, index);
        event.preventDefault();
    }

    onChangeCase() {
        // context organizations, project and case identifiers default selected
        this.contextService.getContext().organizationId = this.selectedOrganization.id;
        this.contextService.getContext().projectId = this.selectedProject.id;
        this.contextService.getContext().caseId = this.selectedCase.id;
        
        // context resource default selected
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

        // publish change case event type
        this.eventBus.cast(this.eventType.APP_CHANGE_CASE, this.contextService.getContext());
    }
    
    onChangeOrganization() {
        // load cases grouped by project
        this.loadCasesByOrganization();    
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
}
