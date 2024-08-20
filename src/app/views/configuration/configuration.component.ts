import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Table } from 'primeng/table';

import { NgEventBus, MetaData } from 'ng-event-bus';

import { ContextService } from '../../shared/services/context.service';
import { AnnotationService } from '../../shared/services/annotation.service';

import { Annotation } from '../../shared/models/annotation.model';
import { EventType } from '../../shared/enum/event-type.enum';
@Component({
    templateUrl: './configuration.component.html'
})    
export class ConfigurationComponent implements OnInit { 
    subscriptionEvents: any; 
    eventType = EventType;

    annotations: Annotation[];
    
    constructor(private router: Router, private contextService: ContextService,  private eventBus: NgEventBus,
        private annotationService: AnnotationService) { }
    
    private loadAvailableAnnotations(caseId: String | null) {
        // set in-memory annotations collection
        if (this.contextService.getContext().caseId) {
            this.annotationService.loadAnnotationsAvailableByCaseId(caseId)
                .subscribe({
                    next: annotations => {
                        this.annotations = annotations;
                    },
                    error: error => {
                        console.error(error.message);
                    }
                });
        }
    }
    
    ngOnInit() {        
        this.subscriptionEvents = this.eventBus.on(this.eventType.APP_CHANGE_CASE)
            .subscribe((meta: MetaData) => {
                if (meta.data.caseId) {
                    this.loadAvailableAnnotations(meta.data.caseId);
                }
            });
        
        if (this.contextService.getContext().caseId) {
            this.loadAvailableAnnotations(this.contextService.getContext().caseId);
        }
    }

    onGlobalFilterCase(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains')
    }

    onAddAnnotation(){
        this.router.navigate(['/configuration-form'])
    }
}