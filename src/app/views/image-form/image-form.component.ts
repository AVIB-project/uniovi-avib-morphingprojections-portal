import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormBuilder } from '@angular/forms';

import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

import { ContextService } from '../../shared/services/context.service';

@Component({
    templateUrl: './image-form.component.html'
})
export class ImageFormComponent {
    imageFormGroup = this.fb.group({
        imageId: [null],
        organizationId: [null], 
        name: ['', Validators.required],
        description: [''],
        image: ['', Validators.required],
        version: ['', Validators.required],
        command: ['', Validators.required],
        parameters: [[]],
    });
    
    constructor(
        private router: Router, private route: ActivatedRoute, private contextService: ContextService,
        private dialog: DynamicDialogRef, private config: DynamicDialogConfig, private fb: FormBuilder) { 
            this.imageFormGroup.reset(this.config.data.image);
    }

    onCancelImage(event: any) {
        event.preventDefault();

        this.dialog.close({action: 'cancel'});    
    }
    
    onAddImage(event: any) {
        event.preventDefault();
        
        this.imageFormGroup.controls.organizationId.setValue(this.contextService.getContext().organizationId);

        this.dialog.close({action: 'save', data: this.imageFormGroup.value});
    }   
}