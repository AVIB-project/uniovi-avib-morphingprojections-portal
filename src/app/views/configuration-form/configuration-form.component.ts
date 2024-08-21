import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormBuilder } from '@angular/forms';

import { NgEventBus, MetaData } from 'ng-event-bus';

import { ContextService } from '../../shared/services/context.service';
import { AnnotationService } from '../../shared/services/annotation.service';

import { EventType } from '../../shared/enum/event-type.enum';
import { AnnotationGroupPipe } from '../../shared/pipe/annotation-group.pipe';
import { AnnotationTypePipe } from '../../shared/pipe/annotation-type.pipe';
import { AnnotationEncodingPipe } from '../../shared/pipe/annotation-encoding.pipe';
import { AnnotationSpacePipe } from '../../shared/pipe/annotation-space.pipe';
import { Annotation } from '../../shared/models/annotation.model';

@Component({
    templateUrl: './configuration-form.component.html',
    providers: [
        AnnotationGroupPipe,        
        AnnotationTypePipe,
        AnnotationEncodingPipe,
        AnnotationSpacePipe,
    ] 
})
export class ConfigurationFormComponent implements OnInit { 
    readonly LANGUAGE_ID = "us"; // mock language. Possible -> English: us; Spanish: es

    subscriptionEvents: any;
    eventType = EventType;
  
    annotationGroups: any[] = [];
    annotationTypes: any[] = [];
    annotationEncodings: any[] = [];
    annotationSpaces: any[] = [];
    projectedByAnnotations: any[] = [];
    projectedByAnnotationValues: any[] = [];
    
    annotations: Annotation[];
    annotation: Annotation;

    annotationFormGroup = this.fb.group({
        annotationId: [''],
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
    
    private getAnnotationGroups() {
        this.annotationGroups = this.annotationGroupPipe.getList().filter(item => item.id != "encoding");
    }
        
    private getAnnotationTypes() {
        this.annotationTypes = this.annotationTypePipe.getList();
    }
    
    private getAnnotationEncodings() {
        this.annotationEncodings = this.annotationEncodingPipe.getList();
    }
    
    private getAnnotationSpaces() {
        this.annotationSpaces = this.annotationSpacePipe.getList();
    }
    
    private loadAvailableAnnotations(caseId: String) {
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
    
    private getProjectedByAnnotations() {
        this.projectedByAnnotations = [];
        
        // get projections grouped by annotation type
        if (this.annotationFormGroup.controls.space.value == 'primal') {
            this.annotations.forEach((annotation: Annotation) => {
                if (annotation.group == 'attribute' && annotation.type == 'enumeration' && annotation.required == true) {
                    let annotationLabel = annotation.label[this.LANGUAGE_ID];

                    this.projectedByAnnotations.push({id: annotation.name, name: annotationLabel});
                }
            });
        }
        else {
            this.annotations.forEach((annotation: Annotation) => {
                if (annotation.group == 'sample' && annotation.type == 'enumeration' && annotation.required == true) {
                    let annotationLabel = annotation.label[this.LANGUAGE_ID];

                    this.projectedByAnnotations.push({id: annotation.name, name: annotationLabel});
                }
            });
        }   
    }

    constructor(private router: Router, private route: ActivatedRoute, private fb: FormBuilder,  private eventBus: NgEventBus,
        private contextService: ContextService, private annotationService: AnnotationService,
        private annotationGroupPipe: AnnotationGroupPipe, private annotationTypePipe: AnnotationTypePipe,
        private annotationEncodingPipe: AnnotationEncodingPipe, private annotationSpacePipe: AnnotationSpacePipe,
        ) {         
    }

    ngOnInit() {   
        this.subscriptionEvents = this.eventBus.on(this.eventType.APP_CHANGE_CASE)
            .subscribe((meta: MetaData) => {
                this.annotationFormGroup.controls.caseId.setValue(meta.data.caseId);

                // get all available annotations from case
                this.loadAvailableAnnotations(meta.data.caseId);
            });   
        
        // recover the annotation Id selected in edit mode
        this.route.params.subscribe(params => {
            let annotationId = params['id'];

            if (annotationId) {
                this.annotationService.getAnnotationById(annotationId)
                    .subscribe((annotation: any) => {
                        if (annotation) {
                            this.annotation = annotation;
                            this.annotationFormGroup.reset(annotation);
                        }
                });
            }
        });  
        
        // get all available annotations from case
        this.loadAvailableAnnotations(this.contextService.getContext().caseId);

        // fill default list from pipelines
        this.getAnnotationGroups();
        this.getAnnotationTypes();        
        this.getAnnotationEncodings();
        this.getAnnotationSpaces();       
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
    
    onPrecalculatedChange(event) {
        if (this.annotationFormGroup.controls.group.value == 'projection' && !this.annotationFormGroup.controls.precalculated.value) {
            this.annotationFormGroup.controls.projectedByAnnotation.setValue(undefined);
        }
    }
    
    onSpaceChange(event) {
        this.getProjectedByAnnotations();
    }
    
    onTypeChange(event) {
        if (this.annotationFormGroup.controls.type.value == 'string') {
            this.annotationFormGroup.controls.colorized.setValue(false);  
            this.annotationFormGroup.controls.values.setValue(undefined);
        }
    }
        
    onProjectedByAnnotationChange(event: any) {
        let projectedByAnnotation: Annotation = this.annotations.find((annotation: Annotation) => annotation.name == this.annotationFormGroup.value.projectedByAnnotation);

        this.annotationService.getAnnotationById(projectedByAnnotation.annotationId)
            .subscribe((annotation: any) => {
                if (annotation) {
                    this.projectedByAnnotationValues = [];
                    
                    annotation.values.forEach((value, index) => {
                        this.projectedByAnnotationValues.push({ id: value, name: value });
                    }); 
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

    ngOnDestroy(): void {
        if(this.subscriptionEvents)
            this.subscriptionEvents.unsubscribe();
    }    
}