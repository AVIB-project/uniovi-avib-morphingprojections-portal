import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormBuilder } from '@angular/forms';

import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

import { ContextService } from '../../shared/services/context.service';

@Component({
    templateUrl: './project-form.component.html'
})
export class ProjectFormComponent {
    projectFormGroup = this.fb.group({
        projectId: [''],
        organizationId: [''], 
        name: ['', Validators.required],
        description: ['']
    });
    
    constructor(
        private router: Router, private route: ActivatedRoute, private contextService: ContextService,
        private dialog: DynamicDialogRef, private config: DynamicDialogConfig, private fb: FormBuilder) { 
            this.projectFormGroup.reset(this.config.data.project);
    }

    onCancelProject(event: any) {
        event.preventDefault();

        this.dialog.close({action: 'cancel'});    
    }
    
    onAddProject(event: any) {
        event.preventDefault();
        
        this.projectFormGroup.controls.organizationId.setValue(this.contextService.getContext().organizationId);

        this.dialog.close({action: 'save', data: this.projectFormGroup.value});
    }   
}