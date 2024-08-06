import { Injectable, } from '@angular/core';

import { of, Observable } from 'rxjs'

import { ContextService } from './context.service';
import { SampleService } from './sample.service';
import { AnnotationService } from './annotation.service';

import { Annotation } from '../models/annotation.model';
import { AttributeName } from '../models/attribute-name.model';
import { AttributeValue } from '../models/attribute-value.model';

@Injectable({
    providedIn: 'root'
})
export class AttributeService {
  private attributesNames: AttributeName[];  
  
  constructor(private sampleService: SampleService, private annotationService: AnnotationService, private contextService: ContextService) { }
  
  private createEncodingAnnotation(annotationSelected: any, coordenate: string): Annotation {
    const annotation: Annotation = {
      caseId: this.contextService.getContext().caseId,
      name: coordenate + '_' + annotationSelected.name,
      description: coordenate.toUpperCase() + " expression annotation for " + annotationSelected.name,      
      group: "encoding",
      encodingName: annotationSelected.name,
      type: 'numeric',
      label: {
        'us': coordenate.toUpperCase() + " " + annotationSelected.label['us'],
        'es': coordenate.toUpperCase() + " " + annotationSelected.label['es']
      },
      values: annotationSelected.values,
      colorized: false,
      precalculated: false,
      required: true
    }

    return annotation;
  }
  
  private deleteEncodingAnnotation(attributeName: string, coordenate: string): boolean {
    this.annotationService.getAnnotations().splice(
      this.annotationService.getAnnotations().findIndex(annotation => annotation.name === coordenate + "_" + attributeName), 1);
    
    return true;
  }

  loadAttributeNames(attributesNames: any[]) {
        attributesNames = attributesNames.sort(
          (p1, p2) =>  (p1 > p2) ? 1 : (p1 < p2) ? -1 : 0);
        
        this.attributesNames = attributesNames;
  }

  getAttributeNames(): AttributeName[] {
        return this.attributesNames;     
  }
  
  addUnsupervisedAttributeAnnotation(attributeValue: any, attributeSpace: string): Observable<Annotation> {
    // STEP01: add expression values to datamatrix dataset for each sample
    for (let i = 0; i < this.sampleService.getSamples().length; i++) {        
        const expression = attributeValue.values.find((expression: any) =>
          expression.sampleId == this.sampleService.getSamples()[i].sample_id);
      
      if (expression) {
        let sample: any = this.sampleService.getSamples()[i];
      
        if (sample)
          sample[attributeValue.attributeId] = expression.value;
        
        //this.sampleService.getSamples()[i][attributeValue.attributeId] = expression.value;
      }
    }
    
    // STEP02: create attribute annotation
    const annotation: Annotation = {
          caseId: this.contextService.getContext().caseId,
          group: "projection",
          space: attributeSpace,
          encoding: 'unsupervised',
          type: 'numeric',
          name: attributeValue.attributeId,
          //encodingName: attributeValue.attribute,
          label: {
            'us': attributeValue.attributeId + ' expression',
            'es': attributeValue.attributeId + ' expresión',
          },
          description: attributeValue.attributeId + ' expression',
          projection: attributeValue.projection,
          colorized: false,
          precalculated: false,
          required: true
    }

    this.annotationService.getAnnotations().push(annotation);
    
    // insert new annotation encodings
    let encodedAnnotations: Annotation[] = [];
  
    encodedAnnotations.push(this.createEncodingAnnotation(annotation, "x"));
    encodedAnnotations.push(this.createEncodingAnnotation(annotation, "y"));
  
    this.annotationService.getAnnotations().push(...encodedAnnotations);

    return of(annotation);   
  }      

  deleteAttributeAnnotation(attributeName: any): Observable<boolean> {
    // STEP01: remove attribute filed in all samples
    for (let i = 0; i < this.sampleService.getSamples().length; i++) {
      let sample: any = this.sampleService.getSamples()[i];
      
      if (sample)
        delete sample[attributeName.name];
      //delete this.sampleService.getSamples()[i][attributeName.name];
    }    

    // STEP02: remove parent annotation attached to attribute
    this.annotationService.getAnnotations().splice(
      this.annotationService.getAnnotations().findIndex(annotation => annotation.name === attributeName.name), 1);

    // STEP03: remove child annotations attached to attribute
    this.deleteEncodingAnnotation(attributeName.name, "x");
    this.deleteEncodingAnnotation(attributeName.name, "y");
  
    return of(true);
  }
}