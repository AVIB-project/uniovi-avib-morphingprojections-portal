import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

// UI primeng components
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService, MenuItem } from 'primeng/api';

// scatter chart component
import createScatterplot from 'regl-scatterplot';

// reactive and stomp components
import { Subscription, lastValueFrom } from 'rxjs';
import { Message } from '@stomp/stompjs'

// color manager component
import chroma from "chroma-js";

// app components
import { SampleGroupFormViewComponent } from './forms/sample-group-view/sample-group-form-view/sample-group-form-view.component';
import { AnalyticsDataFormViewComponent } from './forms/analytics-data-form-view/analytics-data-form-view.component';

// app services, models and enumerations
import { ContextService } from '../../shared/services/context.service';

import { RxStompService } from '../../shared/websocket/rx-stomp.service';

import { NgEventBus, MetaData } from 'ng-event-bus';

//import { UserCaseService } from '../../shared/services/user-case.service';
import { SampleService } from '../../shared/services/sample.service';
import { AnnotationService } from '../../shared/services/annotation.service';
import { AttributeService } from '../../shared/services/attribute.service';
import { AnalyticsService } from '../../shared/services/analytics.service';
import { ProjectionService } from '../../shared/services/projection.service';
import { ExpressionService } from '../../shared/services/expression.service';

import { UserCase } from '../../shared/models/user-case.model';
import { Organization } from '../../shared/models/organization.model';
import { Project } from '../../shared/models/project.model';
import { Case } from '../../shared/models/case.model';
import { Resource } from '../../shared/models/resource.model';
import { Sample } from '../../shared/models/sample.model';
import { Attribute } from '../../shared/models/attribute.model';
import { Annotation } from '../../shared/models/annotation.model';
import { SampleGroup } from '../../shared/models/sample-group.model';
import { AttributeName } from '../../shared/models/attribute-name.model';
import { AttributeValue } from '../../shared/models/attribute-value.model';

import { EventType } from '../../shared/enum/event-type.enum';
import { ViewTypeEnum } from '../../shared/enum/view-type.enum';
import { AnnotationEnum } from '../../shared/enum/annotation.enum';
import { ResourceTypeEnum } from '../../shared/enum/resource-type.enum';
import { AnnotationProjectionEnum } from '../../shared/enum/annotation-projection.enum';

@Component({
    selector: 'projection-component',
    templateUrl: './projection.component.html',
    styleUrls: ['./projection.component.scss'],
    providers: [DialogService, MessageService]
})
export class ProjectionComponent implements OnInit, AfterViewInit, OnDestroy {
    subscriptionEvents: any; 
    eventType = EventType;
    
    @HostListener('document:keydown.escape', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) { 
        this.pointsSelected = [];
    }

    // scatter plot component
    @ViewChild('canvasPlot')
    canvas: ElementRef = {} as ElementRef;

    // scatter plot tooltip component
    @ViewChild('canvasTooltip')
    tooltip: ElementRef = {} as ElementRef;
    
    pointsSelected: any = [];

    isLoading: boolean = false;

    userCase: UserCase | undefined; 
    organizations: Organization[] | undefined;
    projects: Project[] | undefined;
    projectList: any[] | undefined;   
    cases: Case[] | undefined;  
    
    startTime: Date;
    endTime: Date;
    timeInterval: string | undefined;

    resourceTypeEnum = ResourceTypeEnum;
    annotationEnum = AnnotationEnum;
    viewTypeEnum = ViewTypeEnum;
    annotationProjectionEnum = AnnotationProjectionEnum;
    
    // queue async endpoints
    private topicSampleSubscription: Subscription;
    private topicSampleHitsSubscription: Subscription;
    private topicAttributeNamesSubscription: Subscription;
    private topicAttributeNamesHitsSubscription: Subscription;
    private topicAttributeValuesSubscription: Subscription;
    private topicAttributeValuesHitsSubscription: Subscription;
    
    readonly QUEUE_DOMAIN = '/user/queue';

    readonly QUEUE_SAMPLES = this.QUEUE_DOMAIN + '/samples';
    readonly QUEUE_SAMPLES_HITS = this.QUEUE_DOMAIN + '/samples/hit';
    readonly QUEUE_ATTRIBUTE_NAMES = this.QUEUE_DOMAIN + '/attribute/names';
    readonly QUEUE_ATTRIBUTE_NAMES_HITS = this.QUEUE_DOMAIN + '/attribute/names/hit';  
    readonly QUEUE_ATTRIBUTE_VALUES = this.QUEUE_DOMAIN + '/attribute/values';
    readonly QUEUE_ATTRIBUTE_VALUES_HITS = this.QUEUE_DOMAIN + '/attribute/values/hit';
    
    // canvas default definitions
    readonly POINT_SIZE_GROUP_DEF = 4
    readonly OPACITY_GROUP_ENUM_DEF = 0.3

    readonly UNDEFINED_NAME = "Undefined";
    readonly UNDEFINED_DESCRIPTION = "Group undefined";
    readonly UNDEFINED_COLOR = "#000000";

    colorGroups: string[]= [];
    pointSizeGroups: number[] = [];
    opacityGroups: number[]= [];
    
    pointGroups = {
        pointColor: this.colorGroups,
        pointSize: this.pointSizeGroups,
        opacity: this.opacityGroups
    }
    
    // internal fields
    hiddenSpinner: boolean = true;
    hitPercent: number = 0;
    totalDocuments: number = 0;
    showSamplesDataPanel: boolean = false;
    showSamplesGroupPanel: boolean = false;

    // canvas default size
    readonly CANVAS_WIDTH: number = 700;
    readonly CANVAS_HEIGHT: number = 500;
    
    // encoding sensibility coefficient
    readonly SEN_ALPHA = 10

    scatterplot: any;
    samples: Sample[] = [];
    annotationLegends: any[] = [];  
    attributes: Attribute[] = [];
    attributeValue: AttributeValue;
    attributeNames: AttributeName[] = [];
    pointSamples: any = {};
    pointsChart: any = [];
    pointsChartVisible: any = [];  
    pointHover: any = {};
    pointPosition: any;
    pointCode: string = "";

    sampleAnnotations: Annotation[] = []; 
    sampleAnnotationNames: string[] = [];    
    sampleAnnotationExpressions: any[] = [];
    sampleEncodedAnnotationsGrouped: any[] = [];
    sampleGroups: SampleGroup[] = [];
    colorizedAnnotation: Annotation;
    colorizedTitle: string;
        
    projectionOptions: any[] = [
        { icon: 'pi pi-circle', justify: 'Left', styleClass: "p-button-secondary", type: "circle"},
        { icon: 'pi pi-arrows-h', justify: 'Right', styleClass: "p-button-secondary", type: "horizontal"},
        { icon: 'pi pi-arrows-v', justify: 'Center', styleClass: "p-button-secondary", type: "vertical"}
    ];
    projectionSelected: any;
    
    previousHorAttribute: any;
    selectedHorAttribute: any;
    previousVerAttribute: any;
    selectedVerAttribute: any;
  
    legendGroupMenuItems: MenuItem[] | undefined;

    private initCanvas() {
        const canvas = this.canvas.nativeElement;
        const width = this.CANVAS_WIDTH;
        const height = this.CANVAS_HEIGHT;
        
        this.scatterplot = createScatterplot({
            canvas,
            width,
            height,
            lassoInitiator: true,
            lassoOnLongPress: true,
            showReticle: true, 
            reticleColor: [0, 0, 0, 0.66]
        });

        // Activate reticle and set reticle color to red
        //this.scatterplot.set({ reticleColor: [0, 0, 0, 0.66] });
        
        this.scatterplot.subscribe("select", ({ points }) => {
            canvas.value = points;
            canvas.dispatchEvent(new Event("input"));

            this.pointsSelected = [];
            for (let i = 0; i < points.length; i++) {
                this.pointsSelected.push(this.samples[points[i]]);
            }
        });
        
        this.scatterplot.subscribe("pointOver", (point) => {
            // get canvas position
            const { top, left } = this.scatterplot.get('canvas').getBoundingClientRect()

            // get sample hover data from point hovered
            this.pointHover = this.samples[point];
            //this.pointHover = this.samples.find((sample: Sample) => sample.visible == true);
        
            // get position of the hovered point
            this.pointPosition = this.scatterplot.getScreenPosition(point)

            // show the tooltip
            this.tooltip.nativeElement.style.visibility = 'visible';
            this.tooltip.nativeElement.style.position = 'absolute';      
            this.tooltip.nativeElement.style.left = this.pointPosition[0] + left + 5 + "px";
            this.tooltip.nativeElement.style.top = this.pointPosition[1] + top + 5 + "px";
            this.tooltip.nativeElement.style.height = 'auto';      
        });      
        
        this.scatterplot.subscribe("pointOut", (point) => {
            // hide the tooltip
            this.tooltip.nativeElement.style.visibility = 'hidden';
        });     
            
        // setting discrete colors
        this.scatterplot.set({
            opacityBy: 'valueA',
            sizeBy: 'valueA',
            colorBy: 'valueA', 
        });
    }
    
    private loadAnnotations() {
        // set in-memory annotations collection
        this.annotationService.loadAnnotationsAvailableByCaseId(this.contextService.getContext().caseId)
        .subscribe({
            next: annotations => {
                // get all required annotations
                this.getRequiredAnnotations();

                // get all encoding annotations
                this.getEncodingAnnotations();

                // get unique colorized annotation to generate annotation lengend
                this.generateColorizedColorScale();

                // initialize scatter plot canvas with the color generated
                this.scatterplot.clear();
                this.scatterplot.set(this.pointGroups);          
                },
            error: error => {
                console.error(error.message);
            }
        });
    }

    private getRequiredAnnotations() {
        this.annotationService.getRequiredAnnotations()
        .subscribe({
            next: sampleAnnotations => {
                this.sampleAnnotations = sampleAnnotations;
                this.sampleAnnotationNames = this.sampleAnnotations.map(sampleAnnotation => sampleAnnotation.name);
            },
            error: error => {
                console.error(error.message);
            }
        });    
    }
    
    private getEncodingAnnotations(projection?: string) {
        this.sampleAnnotationExpressions = [];
        this.sampleEncodedAnnotationsGrouped = [];

        this.annotationService.getEncodingAnnotations()
            .subscribe({
                next: (annotations: Annotation[]) => {
                    annotations.forEach((annotation: Annotation) => {
                        // get default projection
                        let defaultProjection = this.projectionOptions[0].type;

                        if (annotation.projection)
                            defaultProjection = annotation.projection;
                    
                        this.sampleAnnotationExpressions.push(
                            {
                                annotation: annotation,         // annotation expression attached
                                projection: defaultProjection,  // default expression projection selected (circle)
                                expression: 0,                  // default expression value (slider selection)
                            }
                        );
                    
                        this.sampleEncodedAnnotationsGrouped.push(
                            this.annotationService.getAnnotations().filter((encodedAnnotation: Annotation) => {
                                return encodedAnnotation.encodingName == annotation.name;
                            }));
                    });
                }
            });
    } 
    
    private generateColorizedColorScale() {
        // initialize variables
        this.pointGroups = {
            pointColor: [],
            pointSize: [],
            opacity: []
        };

        this.colorizedTitle = '';
        this.annotationLegends = [];

        // form annotations create legend and initialize chart
        this.annotationService.getColorizedAnnotation().subscribe({
            next: colorizedAnnotation => {
                if (colorizedAnnotation?.values) {
                    this.colorizedAnnotation = colorizedAnnotation;
                    //this.colorizedTitle = colorizedAnnotation?.label[this.LANGUAGE_ID];
                    this.colorizedTitle = colorizedAnnotation?.label[this.contextService.getContext().user.language];

                    // create color legend pallet
                    const scale = chroma.scale(['red', 'blue', 'green']).colors(colorizedAnnotation.values.length);
                    //const scale = chroma.scale('Spectral').colors(colorizedAnnotation.values.length);              

                    // generate canvas group to be initialized from color pallet
                    for (let i = 0; i < colorizedAnnotation.values.length; i++) {
                        this.annotationLegends.push(
                            {
                                name: colorizedAnnotation.values[i],
                                description: colorizedAnnotation.values[i],
                                group: i,
                                color: scale[i]
                            });
                    }
                    
                    // add a final group for not defined values
                    this.annotationLegends.push(
                    {
                        name: this.UNDEFINED_NAME,
                        description: this.UNDEFINED_DESCRIPTION,
                        group: colorizedAnnotation.values.length,
                        color: this.UNDEFINED_COLOR
                    });
                        
                    this.colorGroups = this.annotationLegends.map(legend => legend.color)
                    this.pointSizeGroups = [...Array(this.annotationLegends.length).keys()].map(i => this.POINT_SIZE_GROUP_DEF);
                    this.opacityGroups = [...Array(this.annotationLegends.length).keys()].map(i => this.OPACITY_GROUP_ENUM_DEF);

                    this.pointGroups = {
                        pointColor: this.colorGroups,
                        pointSize: this.pointSizeGroups,
                        opacity: this.opacityGroups
                    }
                }                
            },
            error: error => {
                console.error(error.message);
            }
        });
    }

    private generateGroupsColorScale(sampleGroups: SampleGroup[]) {
        // generate annotation groups from sample groups
        this.annotationLegends = [];

        for (let i = 0; i < sampleGroups.length; i++) {
            this.annotationLegends.push(
                {
                    name: sampleGroups[i].name,
                    description: sampleGroups[i].name,
                    color: sampleGroups[i].color,
                    group: i,          
                    visible: sampleGroups[i].visible,
                });
        }
        
        // add a final annotation group for undefined points
        this.annotationLegends.push(
        {
            name: this.UNDEFINED_NAME,
            description: this.UNDEFINED_DESCRIPTION,
            color: this.UNDEFINED_COLOR,
            group: sampleGroups.length,
            visible: true
        });

        // create chart point groups values (color, size, alpha) for all chart points
        this.colorGroups = this.annotationLegends.map(legend => legend.color)
        this.pointSizeGroups = [...Array(this.annotationLegends.length).keys()].map(i => this.POINT_SIZE_GROUP_DEF);
        this.opacityGroups = [...Array(this.annotationLegends.length).keys()].map(i => this.OPACITY_GROUP_ENUM_DEF);

        this.pointGroups = {
            pointColor: this.colorGroups,
            pointSize: this.pointSizeGroups,
            opacity: this.opacityGroups
        }  
    }

    private webSocketSubscribe() {
        // get sample hits
        this.topicSampleHitsSubscription = this.rxStompService
        .watch(this.QUEUE_SAMPLES_HITS).subscribe((message: Message) => {
            const result = JSON.parse(message.body);

            if (result) {
            this.hitPercent = Math.round((result.hit / result.totalHits) * 100);
            }
        });
        
        // load all samples
        this.topicSampleSubscription = this.rxStompService
        .watch(this.QUEUE_SAMPLES).subscribe((message: Message) => {        
            this.samples = JSON.parse(message.body);
            this.totalDocuments = this.samples.length;

            // set in-memory samples collection
            this.sampleService.loadSamples(this.samples);

            // initialize visible points  
            this.pointsChartVisible = this.samples;

            // recover all attribute names from index project and first sample document(all samples have the same attributes)
            if (this.samples.length > 0) {
            this.rxStompService.publish({
                destination: "/app/findAllAttributeNames",
                //body: JSON.stringify({ 'index': this.contextService.getContext().indexAttributeAnnotation })
                body: JSON.stringify({ 'index': '6637bb3e020918fd5b3b5678' })
            });
            }

            // calculate colorized default groups from dataset
            this.initializeSampleColorizedGroups();

            // recalculate morphing projection dataset
            this.recalculateMorphingProjection();
            
            // center canvas to fit bound
            this.scatterplot.zoomToArea(
            { x: 0, y: 0, width: 1, height: 1 },
            { transition: true }
            );

            // end tracking timestamp
            this.endTime = new Date();
            this.timeInterval = (this.endTime.getTime() - this.startTime.getTime()) / 1000 + " secs";                 

            this.hiddenSpinner = true;
            this.isLoading = false;
        });
        
        // get attribute name Hits
        this.topicAttributeNamesHitsSubscription = this.rxStompService
        .watch(this.QUEUE_ATTRIBUTE_NAMES_HITS).subscribe((message: Message) => {
            const result = JSON.parse(message.body);

            if (result) {
            this.hitPercent = Math.round((result.hit / result.totalHits) * 100);
            }
        });  
        
        // load attribute names
        this.topicAttributeNamesSubscription = this.rxStompService
        .watch(this.QUEUE_ATTRIBUTE_NAMES).subscribe((message: Message) => {
            this.attributeNames = JSON.parse(message.body);
            
            this.attributeService.loadAttributeNames(this.attributeNames);

            this.endTime = new Date();
            this.timeInterval = (this.endTime.getTime() - this.startTime.getTime()) / 1000 + " secs";
        });
            
        // get attribute value Hits
        this.topicAttributeValuesHitsSubscription = this.rxStompService
        .watch(this.QUEUE_ATTRIBUTE_VALUES_HITS).subscribe((message: Message) => {
            const result = JSON.parse(message.body);

            if (result) {
            this.hitPercent = Math.round((result.hit / result.totalHits) * 100);
            }
        }); 
        
        // load attributes values from name
        this.topicAttributeValuesSubscription = this.rxStompService
        .watch(this.QUEUE_ATTRIBUTE_VALUES).subscribe((message: Message) => {        
            this.attributeValue = JSON.parse(message.body);
            this.totalDocuments = this.attributeValue.values.length;

            // add annotations: principal and X/Y annotations for the attribute selected
            this.attributeService.addUnsupervisedAttributeAnnotation(this.attributeValue, "primal")
            .subscribe({
                next: (encodingAnnotation: Annotation) => {
                // samples projection for the attribute value selected
                this.sampleService.updateSamples(encodingAnnotation, this.attributeValue.projection)
                    .subscribe({
                    next: (samples: any[]) => {
                        console.log("Samples updated correctly for the supervised annotation name " + this.attributeValue.attributeId);

                        // refresh encoding annotations to show new selectors
                        this.getEncodingAnnotations(this.attributeValue.projection);                    

                        this.endTime = new Date();
                        this.timeInterval = (this.endTime.getTime() - this.startTime.getTime()) / 1000 + " secs";                     
                    },
                    error: error => {
                        console.error(error.message);
                    }
                    });               
                },
                error: error => {
                console.error(error.message);
                }
            });        
        });   
    }
            
    private initializeSampleColorizedGroups() {
        // initialize scatter points collection
        this.pointSamples = {};

        // create scatter plot points collection grouped by colorized annotation color
        for (let index = 0; index < this.samples.length; index++) {
            // get colorized annotation color
            const annotationGroupColorized = this.annotationLegends.find(item => item.name === this.samples[index][this.colorizedAnnotation.name]);
        
            // set color to each scatter sample point
            if (annotationGroupColorized)
                this.pointSamples[this.samples[index].sample_id] = [0, 0, annotationGroupColorized.group];
            else
                this.pointSamples[this.samples[index].sample_id] = [0, 0, this.annotationLegends[this.annotationLegends.length - 1].group];      
        }
    }
    
    private initializeSampleColorGroups(samples) {
        // temporal sample points object with visible points to be painted by scatter plot
        this.pointSamples = {};

        // create sample points with annotation color group from legends
        for (let index = 0; index < samples.length; index++) {
            const annotationLegend = this.annotationLegends.find(annotationLegend => annotationLegend.name === samples[index].groupName);
            
            // attach the group to all visible points in the chart: if exist or Undefined if the point don't have any group associated with it
            if (annotationLegend)
                this.pointSamples[this.samples[index].sample_id] = [0, 0, annotationLegend.group] ;
            else
                this.pointSamples[this.samples[index].sample_id] = [0, 0, this.annotationLegends[this.annotationLegends.length - 1].group];      
        }
    }

    private calculateSoftMaxWeightsMorphingProjection(sample) {
        let weights = {};

        // apply a to each sample annotation expression selected:
        // - sensibility coefficient 
        // - softmax function
        for (let i = 0; i < this.sampleAnnotationExpressions.length; i++) {
            weights[this.sampleAnnotationExpressions[i].annotation.name] = Math.exp((this.sampleAnnotationExpressions[i].expression / 100) * this.SEN_ALPHA);
        }          

        // calculate total weights
        const sum_weights: any = Object.values(weights).reduce((a: any, b: any) => a + b, 0);
            
        // calculate proportional weight for each annotation expression selected
        Object.keys(weights).forEach(function (key, index) {
            weights[key] = weights[key] / sum_weights;
        });
        
        // apply weights calculated to expression points
        let x_morphingProjected = 0;
        let y_morphingProjected = 0;

        for (let i = 0; i < this.sampleEncodedAnnotationsGrouped.length; i++) {
            if (this.sampleEncodedAnnotationsGrouped[i].length > 0 && sample[this.sampleEncodedAnnotationsGrouped[i][0]["name"]] != undefined)
                x_morphingProjected = x_morphingProjected + sample[this.sampleEncodedAnnotationsGrouped[i][0]["name"]] * weights[this.sampleEncodedAnnotationsGrouped[i][0]["encodingName"]];
            
            if (this.sampleEncodedAnnotationsGrouped[i].length > 0 && sample[this.sampleEncodedAnnotationsGrouped[i][1]["name"]] != undefined)
                y_morphingProjected = y_morphingProjected + sample[this.sampleEncodedAnnotationsGrouped[i][1]["name"]] * weights[this.sampleEncodedAnnotationsGrouped[i][0]["encodingName"]];
        }

        return {
            x: x_morphingProjected,
            y: y_morphingProjected
        }
    }
    
    private recalculateMorphingProjection() {
        // recalculate sample points X/Y position from all active encodings
        for (let index = 0; index < this.samples.length; index++) {
            // recalculate sample X/Y position for each visible chart point from all active encodings
            let pointMorphed = this.calculateSoftMaxWeightsMorphingProjection(this.samples[index])
            
            // set sample X/Y position to each chart points
            this.pointSamples[this.samples[index].sample_id][0] = pointMorphed.x;
            this.pointSamples[this.samples[index].sample_id][1] = pointMorphed.y;
        }

        // parse samples points to chart points to be draw by scatter plot
        this.pointsChart = [];

        for (let index = 0; index < this.samples.length; index++) {
            this.pointsChart.push(this.pointSamples[this.samples[index].sample_id]);      
        }    

        // refresh scatter plot with all chart points
        this.scatterplot.clear();    
        this.scatterplot.draw(this.pointsChart);
    }
    
    private createSampleGroups() {
        this.sampleGroups = [];

        this.samples.forEach(sample => {
            if (sample.groupName) {
                const sampleGroup = this.sampleGroups.find((sampleGroup: SampleGroup) => sampleGroup.name == sample.groupName);

                if (sampleGroup) {
                    sampleGroup.samples.push(sample);
                }
                else {
                    this.sampleGroups.push({
                        name: sample.groupName,
                        color: sample.groupColor,
                        visible: sample.visible,
                        samples: [sample]
                    });
                }
            }  
        });
    }
    
    constructor(public contextService: ContextService, private rxStompService: RxStompService, private eventBus: NgEventBus,
                /*private userCaseService: UserCaseService,*/ private sampleService: SampleService,
                private attributeService: AttributeService, private annotationService: AnnotationService,
                private analyticsService: AnalyticsService,
                private expressionService: ExpressionService, private projectionService: ProjectionService,
                private dialogService: DialogService, private messageService: MessageService) { 
        // resolve mousemove error: Unable to preventDefault inside passive event listener invocation.
        window.addEventListener('mousemove', function() {
        }, { passive: false });
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        // default Tooltip state
        this.tooltip.nativeElement.style.visibility = 'hidden';
        this.tooltip.nativeElement.style.position = 'absolute';
        this.tooltip.nativeElement.style.height = 0;    

        // init canvas
        this.initCanvas();        

        // From organization item
        this.subscriptionEvents = this.eventBus.on(this.eventType.APP_SELECT_CONTEXT)
            .subscribe((meta: MetaData) => {
                if (meta.data.organizationId) {
                    this.onChangeCase();
                }
        });
        
        // From menu item
        if (this.contextService.getContext().organizationId) {
            this.onChangeCase();
        }        
    }

  onLoadCase() {        
    this.isLoading = true;
    this.hitPercent = 0;
    this.hiddenSpinner = false;

    // start tracking timestamp
    this.timeInterval = "Loading ...";
    this.startTime= new Date();

    // recover all samples from index project
    /*this.rxStompService.publish({
        destination: "/app/findAll",
        //body: JSON.stringify({ 'index': this.contextService.getContext().indexSampleProjection })
        body: JSON.stringify({ 'index': '6637bb3c020918fd5b3b5676' })        
    });*/

    this.projectionService.getProjectionPrimal({
        bucketName: this.contextService.getContext().bucketSampleProjection,
        keyObjectName: this.contextService.getContext().fileSampleProjection,
    }).subscribe({      
      next: samples => {
        this.samples = samples;
        this.totalDocuments = this.samples.length;

        // set in-memory samples collection
        this.sampleService.loadSamples(this.samples);

        // initialize visible points  
        this.pointsChartVisible = this.samples;

        // recover all attribute names from index project and first sample document(all samples have the same attributes)
        if (this.samples.length > 0) {
          this.expressionService.getAnnotationsName({
            bucketName: this.contextService.getContext().bucketDataMatrix,
            keyObjectName: this.contextService.getContext().fileDataMatrix,
            }).subscribe({      
              next: annotationNames => { 
                this.attributeNames = annotationNames;
        
                this.attributeService.loadAttributeNames(this.attributeNames);
              },
              error: error => {
                console.error(error.message);
              }
            });
        }

        // calculate colorized default groups from dataset
        this.initializeSampleColorizedGroups();

        // recalculate morphing projection dataset
        this.recalculateMorphingProjection();
        
        // center canvas to fit bound
        this.scatterplot.zoomToArea(
          { x: 0, y: 0, width: 1, height: 1 },
          { transition: true }
        );

        // end tracking timestamp
        this.endTime = new Date();
        this.timeInterval = (this.endTime.getTime() - this.startTime.getTime()) / 1000 + " secs";                 

        this.hiddenSpinner = true;
        this.isLoading = false;                
      },
      error: error => {
        console.error(error.message);
      }
    });
  }
    
    onChangeCase() {
        this.isLoading = false;
        this.hiddenSpinner = true;

        // load annotarions and clean scatter chart
        this.loadAnnotations();

        // Clean attribute encodingd
        this.samples = [];
        this.attributeNames = [];
    }
    
    onExpressionEncodingChange(event) {
        // refresh chart points locations
        this.recalculateMorphingProjection();

        // refresh filter chart points
        this.onContextMenuShowGroupEvent(event, this.annotationLegends);    
    }
    
    onClearFilterByCode() {
        this.pointsSelected = [];
        this.pointCode = "";

        this.scatterplot.deselect();
    }
        
    onFindByCode() {
        var samplesFiltered = this.samples.reduce((acc, curr, index) => {
        if (curr.sample_id.includes(this.pointCode)) {
            acc.push(index);
        }
        return acc;
        }, []);

        console.log(samplesFiltered);

        this.scatterplot.select(samplesFiltered);
    }

    onShowSamplesDataPanel() {
        this.showSamplesDataPanel = !this.showSamplesDataPanel;
    }

    onShowSamplesGroupPanel() {
        this.showSamplesGroupPanel = !this.showSamplesGroupPanel;
    }
    
    onExportChart() {        
        const IMAGE_EXTENSION = '.png';
        let link = document.createElement("a");    
        let fileName = 'samples_point_export_' + new Date().getTime() + IMAGE_EXTENSION;
        
        link.download = fileName;
        link.href = this.canvas.nativeElement.toDataURL('image/png');
        link.click();  
    }
    
    onFilterChart(points) {
        this.showSamplesDataPanel = false;
            
        this.scatterplot.select(points);
    }

    onCenterCanvas() {
        this.scatterplot.zoomToPoints(Array.from(this.samples.keys()), {
        padding: 0.2,
        transition: true,
        transitionDuration: 500,
        });    
    }

    onGroupFromChart(event, group) {
        const annotationGroupViewFormComponent = this.dialogService.open(SampleGroupFormViewComponent, {
        header: 'Sample Group',
        data: {
            sampleGroups:this.sampleGroups,
            group: group
            },
        });
        
        annotationGroupViewFormComponent.onClose.subscribe(async (group: SampleGroup) => {
        let samplesSelected;

        if (this.pointsSelected.length == 0)
            samplesSelected = await lastValueFrom(this.sampleService.getSamplesByGroup(group));
        else
            samplesSelected = this.pointsSelected;
        
        samplesSelected.forEach(sampleSelected => {
            // add new sample group
            const sample = this.samples.find(sample => sample.sample_id == sampleSelected.sample_id);

            sample.groupName = group.name;
            sample.groupColor = group.color;
        });
        
        this.colorizedTitle = "Grouped";
        
        // create sample groups from groups and samples
        this.createSampleGroups();
        
        // create annotation legends and chart points configuration (color, size, alpha) points values
        this.generateGroupsColorScale(this.sampleGroups);

        // create temporal points samples with color group
        this.initializeSampleColorGroups(this.samples);
        
        // set chart points configuration
        this.scatterplot.set(this.pointGroups);

        // create final chart points from points samples and refresh chart plot to be painted
        this.recalculateMorphingProjection();

        // refresh filter chart points
        this.onContextMenuShowGroupEvent(event, this.annotationLegends);

        // deselect any chart point and initialize any chart points selected
        this.pointsSelected = [];
        this.scatterplot.deselect();
        });    
    }
    
    onGroupFromSamples(sampleGroups: SampleGroup[]) {
        this.showSamplesGroupPanel = false;
        //this.sampleGroups = sampleGroups;
        
        this.colorizedTitle = "Grouped";

        // create sample groups from groups and samples
        this.createSampleGroups();
        
        // generate custom color legen
        this.generateGroupsColorScale(this.sampleGroups);

        // intialize samples with custom colors
        this.initializeSampleColorGroups(this.samples);
        
        // set new color points
        this.scatterplot.set(this.pointGroups);

        // refresh and recalculate morphing projection
        this.recalculateMorphingProjection();

        // refresh filter chart points
        this.onContextMenuShowGroupEvent(event, this.annotationLegends);
        
        this.pointsSelected = [];
        this.scatterplot.deselect();    
    }
    
    async onClearGroups(event) {
        // clear all custom groups and remove all groups from samples too
        this.sampleGroups = [];
        
        this.samples.forEach(sample => {
        sample.groupName = undefined
        sample.groupColor = undefined;
        });
        
        await this.sampleService.showAllSamples().subscribe();
        
        // generate default color annotations
        this.generateColorizedColorScale();
        
        // calculate colorized group from dataset
        this.initializeSampleColorizedGroups();

        // configure scatter plot with color, size and alpha attributes
        this.scatterplot.set(this.pointGroups);

        // recalculate morphing projection dataset
        this.recalculateMorphingProjection();

        this.pointsSelected = [];
        this.scatterplot.deselect();    
    }
    
    onSelectProjection(option) {
        if (option.projection == undefined)
        return;
        
        console.log(option.annotation.annotationId);
        console.log(option.projection.type);

        // if we don't pass any projection type the default one will be circle
        this.sampleService.updateSamples(option.annotation, option.projection.type)
        .subscribe({
            next: (samples: any[]) => {
            console.log("Samples updated correctly for the unsupervised annotation name " + option.annotation.annotationId);

            this.recalculateMorphingProjection();          
            },
            error: error => {
            console.error(error.message);
            }
        });
    }

    onHorAttributeSelect() {
        if (this.selectedHorAttribute != null) {
        this.previousHorAttribute = this.selectedHorAttribute;

        // add attribute annotation
        this.timeInterval = "Please wait ...";
        this.startTime = new Date();
        
        //TODO
        /*this.rxStompService.publish({
            destination: "/app/findAllAttributeValuesByAttributeId",
            body: JSON.stringify({
            'index': "6601a86f743b75d15658dabc",
            'attributeId': this.selectedHorAttribute.attributeId,
            'projection': 'horizontal'
            })        
        });*/

        this.expressionService.getAnnotationsValue({
            bucketName: this.contextService.getContext().bucketDataMatrix,
            keyObjectName: this.contextService.getContext().fileDataMatrix,
            annotationId: this.selectedHorAttribute
            }).subscribe({      
            next: annotationValues => { 
                //this.attributeValue = JSON.parse(annotationValues.body);
                this.attributeValue = {
                attributeId: this.selectedHorAttribute,
                projection: this.annotationProjectionEnum.Horizontal,
                values: annotationValues
                }

                // add annotations: principal and X/Y annotations for the attribute selected
                this.attributeService.addUnsupervisedAttributeAnnotation(this.attributeValue, "primal")
                .subscribe({
                    next: (encodingAnnotation: Annotation) => {
                    // samples projection for the attribute value selected
                    this.sampleService.updateSamples(encodingAnnotation, this.attributeValue.projection)
                        .subscribe({
                        next: (samples: any[]) => {
                            console.log("Samples updated correctly for the supervised annotation name " + this.attributeValue.attributeId);

                            // refresh encoding annotations to show new selectors
                            this.getEncodingAnnotations(this.attributeValue.projection);
                        },
                        error: error => {
                            console.error(error.message);
                        }
                        });               
                    },
                    error: error => {
                    console.error(error.message);
                    }
                });
            },
            error: error => {
                console.error(error.message);
            }
            });   
        } else {
        this.attributeService.deleteAttributeAnnotation(this.previousHorAttribute)
            .subscribe({
            next: (result: boolean) => {
                this.previousHorAttribute = undefined;

                // refresh encoding annotations to remove slider selectors
                this.getEncodingAnnotations();
            },
            error: error => {
                console.error(error.message);
            }
            });
        }
    }

    onVerAttributeSelect() {
        if (this.selectedVerAttribute != null) {
        this.previousVerAttribute = this.selectedVerAttribute;

        // add attribute annotation
        this.timeInterval = "Please wait ...";
        this.startTime = new Date();
                
        //TODO
        /*this.rxStompService.publish({
            destination: "/app/findAllAttributeValuesByAttributeId",
            body: JSON.stringify({
            'index': this.contextService.getContext().indexDataMatrix,
            'attributeId': this.selectedVerAttribute.attributeId,
            'projection': 'vertical'
            })        
        });*/

        this.expressionService.getAnnotationsValue({
            bucketName: this.contextService.getContext().bucketDataMatrix,
            keyObjectName: this.contextService.getContext().fileDataMatrix,
            annotationId: this.selectedVerAttribute
            }).subscribe({      
            next: annotationValues => {
                this.attributeValue = {
                attributeId: this.selectedVerAttribute,
                projection: this.annotationProjectionEnum.Vertical,
                values: annotationValues
                }

                // add annotations: principal and X/Y annotations for the attribute selected
                this.attributeService.addUnsupervisedAttributeAnnotation(this.attributeValue, "primal")
                .subscribe({
                    next: (encodingAnnotation: Annotation) => {
                    // samples projection for the attribute value selected
                    this.sampleService.updateSamples(encodingAnnotation, this.attributeValue.projection)
                        .subscribe({
                        next: (samples: any[]) => {
                            console.log("Samples updated correctly for the supervised annotation name " + this.attributeValue.attributeId);

                            // refresh encoding annotations to show new selectors
                            this.getEncodingAnnotations(this.attributeValue.projection);
                        },
                        error: error => {
                            console.error(error.message);
                        }
                        });               
                    },
                    error: error => {
                    console.error(error.message);
                    }
                });
            },
            error: error => {
                console.error(error.message);
            }
            });      
        } else {
        this.attributeService.deleteAttributeAnnotation(this.previousVerAttribute)
            .subscribe({
            next: (result: boolean) => {
                this.previousVerAttribute = undefined;

                // refresh encoding annotations to remove slider selectors
                this.getEncodingAnnotations();
            },
            error: error => {
                console.error(error.message);
            }
            });
        }
    }

    onContextMenu(event, annotationLegend, cm) {
        event.preventDefault();
        event.stopPropagation();
    
        // only show context menu for custom groups and not Undefined one
        if (this.sampleGroups.length == 0 || annotationLegend.name == "Undefined")
        return false;
        
        // dynamic menu item configuration for each legent item
        this.legendGroupMenuItems = [
        { label: 'Edit Color', icon: 'pi pi-fw pi-pencil', disabled: annotationLegend.visible == false, command: event => this.onContextMenuEditColorGroupEvent(event, annotationLegend) },
        { label: 'Hide Group', icon: 'pi pi-fw pi-eye-slash', disabled: annotationLegend.visible == false, command: event => this.onContextMenuHideGroupEvent(event, annotationLegend) },
        { label: 'Show Group', icon: 'pi pi-fw pi-eye', disabled: annotationLegend.visible == true, command: event => this.onContextMenuShowGroupEvent(event, annotationLegend) }
        ];
        
        cm.model = this.legendGroupMenuItems;
        
        // show context menu    
        cm.show(event);

        return false;
    }

    onContextMenuEditColorGroupEvent(event, annotationLegend) {
        this.onGroupFromChart(event, annotationLegend);
    }
    
    async onContextMenuHideGroupEvent(event, annotationLegend) {
        // reset all filtered points
        this.scatterplot.unfilter();

        // create visible chart point indices
        this.pointsChartVisible = await lastValueFrom(this.sampleService.hideSamplesByGroup(annotationLegend));
        
        // filter chart
        this.scatterplot.filter(this.pointsChartVisible);
    }
    
    async onContextMenuShowGroupEvent(event, annotationLegend) {
        // reset all filtered points
        this.scatterplot.unfilter();

        // create visible chart points indices
        this.pointsChartVisible = await lastValueFrom(this.sampleService.showSamplesByGroup(annotationLegend));

        // filter chart
        this.scatterplot.filter(this.pointsChartVisible);
    }

    async onExecuteAnalytics(event) {
        const annotations = await lastValueFrom(this.annotationService.getSampleRequiredAndMandatoryAnnotations());
        
        const analyticsDataFormViewComponent = this.dialogService.open(AnalyticsDataFormViewComponent, {
        data: {
            view: this.viewTypeEnum.SAMPLE_VIEW,
            samples: this.samples,
            sampleAnnotations: annotations,
            attributes: this.attributes,
            attributeAnnotations: this.attributeNames,
            groups: this.sampleGroups
        },
        width: "75%",
        header: 'Analytics Chart View'
        });
    }
    
    ngOnDestroy() {
        if(this.topicSampleHitsSubscription)
            this.topicSampleHitsSubscription.unsubscribe();
        
        if(this.topicSampleSubscription)
            this.topicSampleSubscription.unsubscribe();
        
        if(this.topicAttributeNamesHitsSubscription)        
            this.topicAttributeNamesHitsSubscription.unsubscribe();
        
        if(this.topicAttributeNamesSubscription)        
            this.topicAttributeNamesSubscription.unsubscribe();
        
        if(this.topicAttributeValuesSubscription)                
            this.topicAttributeValuesSubscription.unsubscribe();
        
        if(this.topicAttributeValuesHitsSubscription)
            this.topicAttributeValuesHitsSubscription.unsubscribe();
        
        if(this.subscriptionEvents)
            this.subscriptionEvents.unsubscribe();        
    }
}