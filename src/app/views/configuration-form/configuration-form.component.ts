import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormBuilder } from '@angular/forms';

import { ContextService } from '../../shared/services/context.service';
import { AnnotationService } from '../../shared/services/annotation.service';

import { AnnotationGroupPipe } from '../../shared/pipe/annotation-group.pipe';
import { AnnotationSpacePipe } from '../../shared/pipe/annotation-space.pipe';
import { AnnotationTypePipe } from '../../shared/pipe/annotation-type.pipe';
import { Annotation } from '../../shared/models/annotation.model';
@Component({
    templateUrl: './configuration-form.component.html',
    providers: [
        AnnotationGroupPipe,
        AnnotationSpacePipe,
        AnnotationTypePipe,
    ] 
})
export class ConfigurationFormComponent implements OnInit { 
    annotationFormGroup = this.fb.group({
        annotationId: [null],
        caseId: [''],
        name: ['', Validators.required],
        description: [''],
        label: ['', Validators.required],
        group: ['', Validators.required],
        type: ['', Validators.required],
        values: [''],
        space: [''],
        projection: [''],        
        projectedByAnnotation: [''],
        projectedByAnnotationValue: [''],
        encoding: ['', Validators.required],
        precalculated: [false, Validators.required],
        colorized: [false, Validators.required],
        required: [true, Validators.required],
    });
  
    annotationGroups: any[] = [];
    annotationSpaces: any[] = [];
    annotationTypes: any[] = [];
    projectedByAnnotations: any[] = [];
    projectedByAnnotationValues: any[] = [];
    
    annotationId: String;
    annotation: any;

    private getAnnotationGroups() {
        this.annotationGroups = this.annotationGroupPipe.getList().filter(item => item.id != "encoding");
    }
    
    private getAnnotationSpaces() {
        this.annotationSpaces = this.annotationSpacePipe.getList();
    }
    
    private getAnnotationTypes() {
        this.annotationTypes = this.annotationTypePipe.getList();
    }
    
    constructor(private router: Router, private route: ActivatedRoute, private fb: FormBuilder,
        private contextService: ContextService, private annotationService: AnnotationService,
        private annotationGroupPipe: AnnotationGroupPipe, private annotationSpacePipe: AnnotationSpacePipe,
        private annotationTypePipe: AnnotationTypePipe) {         
    }

    ngOnInit() {   
        this.route.params.subscribe(params => {
            this.annotationId = params['id'];

            if (this.annotationId) {
                this.annotationService.getAnnotationById(this.annotationId)
                    .subscribe((annotation: any) => {
                        if (annotation) {
                            console.log(annotation);
                            this.annotationFormGroup.setValue(annotation);
                        }
                });
            }
        });  
        
        this.getAnnotationGroups();
        this.getAnnotationSpaces();
        this.getAnnotationTypes();           
    }

    onGroupChange(event: any) {
        this.annotationFormGroup.controls.colorized.setValue(false);

        // projection annotations
        if (this.annotationFormGroup.controls.group.value == 'projection') {
            this.annotationFormGroup.controls.encoding.setValue('supervised');
            this.annotationFormGroup.controls.type.setValue('numeric');
            this.annotationFormGroup.controls.projection.setValue('tsne');
            this.annotationFormGroup.controls.colorized.setValue(false);            
            this.annotationFormGroup.controls.values.setValue(null);
        }
        // sample or attribute annotations
        else {      
            this.annotationFormGroup.controls.space.setValue(null);
            this.annotationFormGroup.controls.encoding.setValue(null);
            this.annotationFormGroup.controls.projectedByAnnotation.setValue(null);
            this.annotationFormGroup.controls.projectedByAnnotationValue.setValue(null);
            this.annotationFormGroup.controls.projection.setValue(null);
        }
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