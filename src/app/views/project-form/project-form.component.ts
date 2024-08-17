import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormBuilder } from '@angular/forms';

import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
    templateUrl: './project-form.component.html'
})
export class ProjectFormComponent { 
    projectFormGroup = this.fb.group({
        projectId: [''],        
        name: ['', Validators.required],
        description: ['']
    });
    
    constructor(
        private router: Router, private route: ActivatedRoute,
        private dialog: DynamicDialogRef, private config: DynamicDialogConfig, private fb: FormBuilder) { 
            console.log(this.config.data.project);
            this.projectFormGroup.reset(this.config.data.project);
    }

    onCancelProject(event: any) {
        event.preventDefault();

        this.dialog.close({action: 'cance'});    
    }
    
    onAddProject(event: any) {
        event.preventDefault();
        
        this.dialog.close({action: 'save', data: this.projectFormGroup.value});
    }   
}