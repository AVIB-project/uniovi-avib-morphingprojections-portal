import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { DialogService } from 'primeng/dynamicdialog';

import { NgEventBus, MetaData } from 'ng-event-bus';

import { ContextService } from '../../shared/services/context.service';

import { EventType } from '../../shared/enum/event-type.enum';

@Component({
    templateUrl: './ingestion-form.component.html',
    providers: [DialogService]
})
export class IngestionFormComponent implements OnInit { 
    subscriptionEvents: any;
    eventType = EventType;
    
    constructor(
        private router: Router, private route: ActivatedRoute, private eventBus: NgEventBus,
        private dialogService: DialogService,
        private contextService: ContextService) {         
    }            
    
    ngOnInit() {             
    }

    onCloseResource(event: Event) {
        this.router.navigate(['/ingestion']);
    }
    
    onResource(event: Event) {        
    }

    ngOnDestroy(): void {
        if(this.subscriptionEvents)
            this.subscriptionEvents.unsubscribe();
    }    
}