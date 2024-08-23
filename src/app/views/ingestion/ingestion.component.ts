import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Table } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';

import { NgEventBus, MetaData } from 'ng-event-bus';

import { EventType } from '../../shared/enum/event-type.enum';
import { ContextService } from '../../shared/services/context.service';
import { ResourceService } from '../../shared/services/resource.service';
import { Resource } from '../../shared/models/resource.model';

@Component({
    templateUrl: './ingestion.component.html',
    providers: [ConfirmationService]
})
export class IngestionComponent implements OnInit {
    subscriptionEvents: any; 
    eventType = EventType;

    resources: Resource[];
    
    constructor(
        private router: Router, private eventBus: NgEventBus, private confirmationService: ConfirmationService, 
        public contextService: ContextService, private resourceService: ResourceService,) { 
    }

    private loadResources(caseId: string) {
        this.resourceService.getResourcesByCaseId(caseId)
        .subscribe({
            next: (resources: Resource[]) => {
                this.resources = resources;          
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
                if (meta.data.organizationId) {
                    this.loadResources(meta.data.caseId);
                }
            });
        
        // From menu item
        if (this.contextService.getContext().organizationId && this.contextService.getContext().user.userId) {
            this.loadResources(this.contextService.getContext().caseId);
        }
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

    onAddResource(){
        this.router.navigate(['/ingestion-form'])
    }

    onRemoveResource(event: Event, resource: Resource) {
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
                if (resource.id) {
                    this.resourceService.deleteResouce(
                        this.contextService.getContext().organizationId,
                        this.contextService.getContext().projectId,
                        this.contextService.getContext().caseId,
                        resource.file)
                    .subscribe({
                        next: () => {
                            this.loadResources(this.contextService.getContext().caseId);
                        },
                        error: error => {
                            console.error(error.message);
                        }
                    }); 
                }
            }
        });
    }
    
    ngOnDestroy(): void {
        if(this.subscriptionEvents)
            this.subscriptionEvents.unsubscribe();
    }       
}