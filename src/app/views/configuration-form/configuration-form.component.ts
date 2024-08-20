import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormBuilder } from '@angular/forms';

import { ContextService } from '../../shared/services/context.service';
import { AnnotationService } from '../../shared/services/annotation.service';
import { Annotation } from '../../shared/models/annotation.model';
@Component({
    templateUrl: './configuration-form.component.html'
})
export class ConfigurationFormComponent implements OnInit { 
    annotationFormGroup = this.fb.group({
    });
  
    caseId: String;
    constructor(private router: Router, private route: ActivatedRoute, private fb: FormBuilder,
        private contextService: ContextService, private annotationService: AnnotationService) {         
    }

    ngOnInit() {   
        this.route.params.subscribe(params => {
            this.caseId = params['id'];

            if (this.caseId) {
                /*this.annotationService.getCaseById(this.caseId)
                    .subscribe((case: any) => {
                        if (case) {
                            this.annotationFormGroup.setValue(case);
                        }
                });*/
            }
        });        
    }

    onCancelAnnotation() {
        this.router.navigate(['/configuration'])
    }

    onAddAnnotation() {
        // set the final organization Id
        //this.annotationFormGroup.controls.caseId.setValue(this.contextService.getContext().caseId);
        
        /*this.annotationService.saveAnnotation(this.annotationFormGroup.value)
            .subscribe((userId: any) => {
                console.log(userId);

                this.router.navigate(['/configuration'])
            });*/                
    }
}