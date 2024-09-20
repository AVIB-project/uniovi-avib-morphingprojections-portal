import { Component, OnInit, ViewChild, HostListener } from '@angular/core';

import { Table } from 'primeng/table'
import { DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

import { ContextService } from '../../../../shared/services/context.service';

import { SampleService } from '../../../../shared/services/sample.service';
import { AnnotationService } from '../../../../shared/services/annotation.service';

import { Annotation } from '../../../../shared/models/annotation.model';

import { AnnotationGroupPipe } from '../../../../shared/pipe/annotation-group.pipe';
import { AnnotationTypePipe } from '../../../../shared/pipe/annotation-type.pipe';
import { AnnotationEncodingPipe } from '../../../../shared/pipe/annotation-encoding.pipe';
import { AnnotationSpacePipe } from '../../../../shared/pipe/annotation-space.pipe';

@Component({
  selector: 'annotation-annotation-view',
  templateUrl: './annotation-annotation-view.component.html',
  styleUrls: ['./annotation-annotation-view.component.scss',
    '../../../../../assets/demo/styles/flags/flags.css'],
  providers: [
    ConfirmationService,
    AnnotationGroupPipe,
    AnnotationTypePipe,
    AnnotationEncodingPipe,
    AnnotationSpacePipe
  ]  
})
export class AnnotationViewComponent implements OnInit {
  @ViewChild('annotationsConfigTable')
  annotationsConfigTable: Table | undefined;

  @ViewChild('fileUpload', {static: false}) 
  fileUpload: any;
  
  isLoading: boolean = false;
  sampleAnnotation: Annotation;
  sampleAnnotations: Annotation[];
  sampleAnnotationNames = [];

  filterGlobal = null;
  selectedAnnotations: Annotation[];
  scrollHeight: string = "450px";

  readonly LANGUAGE_ID = "us";
  
  annotationGroups: any[] = [];
  annotationTypes: any[] = [];
  annotationEncodings: any[] = [];
  annotationSpaces: any[] = [];
  
  constructor(private contextService: ContextService,
    private messageService: MessageService,
    private config: DynamicDialogConfig,
    private sampleService: SampleService,
    private annotationService: AnnotationService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
    private annotationGroupPipe: AnnotationGroupPipe,
    private annotationTypePipe: AnnotationTypePipe,
    private annotationEncodingPipe: AnnotationEncodingPipe,
    private annotationSpacePipe: AnnotationSpacePipe) {
  }
  
  getAnnotationGroups() {
    this.annotationGroups = this.annotationGroupPipe.getList().filter((group) => group.id !== 'encoding');
  }

  getAnnotationTypes() {
    this.annotationTypes = this.annotationTypePipe.getList();
    }
  
  getAnnotationEncodings() {
    this.annotationEncodings = this.annotationEncodingPipe.getList();
  }

  getAnnotationSpaces() {
    this.annotationSpaces = this.annotationSpacePipe.getList();
  }
  
  getLabelsByAnnotation(sampleAnnotation: Annotation) {
    let labels = [];

    Object.entries(sampleAnnotation.label).forEach(([language, value]) => {        
      labels.push({ code: language, name: value });
    });

    return labels;
  }

  ngOnInit() {
    this.sampleAnnotations = this.config.data.sampleAnnotations;
    this.sampleAnnotationNames = this.config.data.sampleAnnotationNames;

    this.getAnnotationGroups();
    this.getAnnotationTypes();
    this.getAnnotationEncodings();
    this.getAnnotationSpaces();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.scrollHeight = window.innerHeight - 460 + "px";
  }
  
  onApplyFilterGlobal(event: any, stringVal: any) {
    this.annotationsConfigTable!.filterGlobal(event.value, stringVal);
  }

  onClearFilterGlobal(event: any) {
    this.annotationsConfigTable!.clear();
    this.filterGlobal = null;
  }

  onAddSupervisedEncodingAnnotation(event, selectedAnnotation: Annotation) {
    this.annotationService.addSupervisedEncodingAnnotation(selectedAnnotation, "primal")
      .subscribe({
        next: (encodingAnnotation: Annotation) => {          
          this.sampleService.updateSamples(encodingAnnotation)
            .subscribe({
              next: (samples: any[]) => {
                console.log("Samples updated correctly for the supervised annotation name " + selectedAnnotation.name);
              },
              error: error => {
                console.error(error.message);
              }
            }); 
        },
        error: error => {
          console.error(error.message); 
        }
      })
  }

  onAddUnsupervisedEncodingAnnotation(event, selectedAnnotation: Annotation) {
    this.annotationService.addUnsupervisedEncodingAnnotation(selectedAnnotation, "primal")
      .subscribe({
        next: (encodingAnnotation: Annotation) => {     
          this.sampleService.updateSamples(encodingAnnotation)
            .subscribe({
              next: (samples: any[]) => {
                console.log("Samples updated correctly for the unsupervised annotation name " + selectedAnnotation.name);
              },
              error: error => {
                console.error(error.message);
              }
            });      
        },
        error: error => {
          console.error(error.message); 
        }
      })
  }

  onDeleteEncodingAnnotation(event, selectedAnnotation: Annotation) {
    this.annotationService.deleteEncodingAnnotation(selectedAnnotation)
      .subscribe({
        next: (annotationName: string) => {          
          console.log("Encoding annotation delete correctly for sample name " + annotationName);
        },
        error: error => {
          console.error(error.message); 
        }
      })    
  }

  onColorizedEncodingAnnotation(event, selectedAnnotation: Annotation) {
    this.annotationService.setColorizedEncodingAnnotation(selectedAnnotation)
      .subscribe({
        next: (result: boolean) => {          
          console.log("Colorized annotation selected correctly for sample name " + selectedAnnotation.name);
        },
        error: error => {
          console.error(error.message); 
        }
      })  
  }
}
