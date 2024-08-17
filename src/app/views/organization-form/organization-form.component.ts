import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormBuilder } from '@angular/forms';

import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
    templateUrl: './organization-form.component.html'
})
export class OrganizationFormComponent { 
    organizationFormGroup = this.fb.group({
        organizationId: [''],        
        name: ['', Validators.required],
        description: ['']
    });
    
    constructor(
        private router: Router, private route: ActivatedRoute,
        private dialog: DynamicDialogRef, private config: DynamicDialogConfig, private fb: FormBuilder) { 
            this.organizationFormGroup.reset(this.config.data.organization);
    }

    onCancelOrganization(event: any) {
        event.preventDefault();

        this.dialog.close({action: 'cance'});    
    }
    
    onAddOrganization(event: any) {
        event.preventDefault();
        
        this.dialog.close({action: 'save', data: this.organizationFormGroup.value});
    }   
}