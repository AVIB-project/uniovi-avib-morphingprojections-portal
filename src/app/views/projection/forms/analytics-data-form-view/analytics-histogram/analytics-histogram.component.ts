import { Component, OnInit, Input,  ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';

import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

import { ContextService } from '../../../../../shared/services/context.service';

import { AnalyticsService } from '../../../../../shared/services/analytics.service';

import { ViewTypeEnum } from '../../../../../shared/enum/view-type.enum';
import { UIChart } from 'primeng/chart';

function sampleAnnotationValidator(formControl: AbstractControl) {
  if (!formControl.parent) {
    return null;
  }
  
  if (formControl.value == undefined && formControl.parent.get('filterType').value == "filter_sample")
    return { sampleAnnotationRequired: true }
  else
    return null;
}

function attributeAnnotationValidator(formControl: AbstractControl) {
  if (!formControl.parent) {
    return null;
  }
  
  if (formControl.value == undefined && formControl.parent.get('filterType').value == "filter_attribute")
    return { attributeAnnotationRequired: true }
  else
    return null;
}

@Component({
  selector: 'analytics-histogram',
  templateUrl: './analytics-histogram.component.html',
  styleUrls: ['./analytics-histogram.component.scss'],
})
export class AnalyticsHistogramComponent implements OnInit {
  readonly LANGUAGE_ID = "us"; // English: us; Spanish: es
  
  @Input() viewInput: ViewTypeEnum;
  @Input() groupsInput: any;
  @Input() samplesInput: any[] = [];
  @Input() sampleAnnotationsInput: any[] = [];
  @Input() attributesInput: any[] = [];
  @Input() attributeAnnotationsInput: any[] = [];
  
  @ViewChild('chartPlot')
  chartAnalytics: UIChart;

  viewTypeEnum = ViewTypeEnum;
  samples: any[] = [];
  sampleAnnotations: any[] = [];
  attributes: any[] = [];
  attributeAnnotations: any[] = [];
  showFilterSampleAnnotationPanel: boolean = true;
  showFilterAttributeAnnotationPanel: boolean = false;
  
  analyticsFormViewGroup = this.fb.group({
    name: ['Histogram Name', Validators.required],      
    title: ['Histogram Title', Validators.required],
    view: new FormControl<string | null>(null),
    filterType: ['filter_sample'],
    filterSampleAnnotation: [null, [sampleAnnotationValidator]],
    filterAttributeAnnotation: [null, [attributeAnnotationValidator]],
    bins: [5, Validators.required],  
    groups: this.fb.array([
      this.fb.group({
        name: new FormControl<string | null>(null),
        color: new FormControl<string | null>(null),
        values: this.fb.array([]),
      })
    ])
  });

  readonly documentStyle = getComputedStyle(document.documentElement);
  readonly textColor = this.documentStyle.getPropertyValue('--text-color');
  readonly textColorSecondary = this.documentStyle.getPropertyValue('--text-color-secondary');
  readonly surfaceBorder = this.documentStyle.getPropertyValue('--surface-border');
  
  options: any;
  requestAnalytics: any;
  responseAnalytics: any;
  data: any;
  
  hiddenSpinner: boolean = true;

  constructor(private contextService: ContextService,
              private dialog: DynamicDialogRef,
              private config: DynamicDialogConfig,
              private fb: FormBuilder,
              private analyticsService: AnalyticsService) { }

  ngOnInit() {
    // fill filters data 
    this.fillSamples();
    this.fillSampleAnnotations();
    this.fillAttributes();
    this.fillAttributeAnnotations();

    // initialize filter and chart components
    this.initFilterComponent();
    this.initChartComponent(); 
  }

  private fillSamples() {
    this.samples = [];

    this.samplesInput.forEach((sample) =>
      this.samples.push({ key: sample.sample_id, value: sample.sample_id })
    );
  }

  private fillAttributes() {
    this.attributes = [];

    this.attributesInput.forEach((attribute) =>
      this.samples.push({ key: attribute.attributeId, value: attribute.attributeId })
    );
  }

  private fillSampleAnnotations() {
    this.sampleAnnotations = [];

    this.sampleAnnotationsInput.forEach((sampleAnnotation) =>
      this.sampleAnnotations.push({ key: sampleAnnotation.name, value: sampleAnnotation.label[this.LANGUAGE_ID] })
    );
  }

  private fillAttributeAnnotations() {
    this.attributeAnnotationsInput.forEach((attributeAnnotation) =>
      this.attributeAnnotations.push({ key: attributeAnnotation, value: attributeAnnotation })
    );
  }
 
  private initFilterComponent() {
    this.analyticsFormViewGroup.controls.view.setValue(this.viewInput);

    let groups: FormArray = this.analyticsFormViewGroup.get('groups') as FormArray;
    groups.clear();
    
    this.groupsInput.forEach((group) => {
      if (this.viewInput == this.viewTypeEnum.SAMPLE_VIEW) {
        let groupSamples = this.fb.array([]);
        
        for (let i = 0; i < group.samples.length; i++) {
          groupSamples.push(new FormControl(group.samples[i].sample_id));
        };
         
        groups.push(new FormGroup({
            name: new FormControl(group.name),
            color: new FormControl(group.color),
            values: groupSamples
        }));                
      }
    })
  }  
  
  private initChartComponent() {    
    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        title: {
          display: true,
          title: "Chart"
        },                  
        legend: {
          labels: {
            color: this.textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
              color: this.textColorSecondary,
              font: {
                  weight: 500
              }
          },
          grid: {
              color: this.surfaceBorder,
              drawBorder: false
          }
        },
        y: {
          ticks: {
              color: this.textColorSecondary
          },
          grid: {
              color: this.surfaceBorder,
              drawBorder: false
          }
        }
      }
    }
  }  
  
  private fillDataChart() {
    this.data = { labels: [], datasets: [] };
    
    if (this.data == undefined || this.responseAnalytics.length == 0)
        return;
    
    // create labels chart
    if (this.responseAnalytics.length > 0) {
      for (const key in this.responseAnalytics[0]) {
        if (['group', 'color'].indexOf(key) === -1) {
          this.data.labels.push(key);
        }
      }
    }
      
    // create bins chart
    let groupAnalytics = this.responseAnalytics.reduce((x, y) => {
            (x[y.group] = x[y.group] || []).push(y);

            return x;
    }, {});
    
    Object.keys(groupAnalytics).forEach((group) => {
      let bin = {
        label: groupAnalytics[group][0].group,
        backgroundColor: groupAnalytics[group][0].color,
        borderColor: groupAnalytics[group][0].color,
        data: []
      }
            
      groupAnalytics[group].forEach((item) => {
        for (const key in item) {
          if (['group', 'color'].indexOf(key) === -1) {
            bin.data.push(item[key]);            
          }
        }
      });

      this.data.datasets.push(bin);                       
    })      
  }

  onSelectAnnotationType(event) {
    if (event.value == "filter_attribute") {
      this.analyticsFormViewGroup.get('filterSampleAnnotation').setValue(null);
    }
    else {
      this.analyticsFormViewGroup.get('filterAttributeAnnotation').setValue(null);
      this.analyticsFormViewGroup.get('bins').setValue(5);
    }
  }

  onCalculateClick(event) {
    // get analytics request parameters
    this.requestAnalytics = this.analyticsFormViewGroup.value;
    
    // add resource request metadata
    this.requestAnalytics.bucketDataMatrix = this.contextService.getContext().bucketDataMatrix;
    this.requestAnalytics.fileDataMatrix = this.contextService.getContext().fileDataMatrix;
    this.requestAnalytics.bucketSampleAnnotation = this.contextService.getContext().bucketSampleAnnotation;
    this.requestAnalytics.fileSampleAnnotation = this.contextService.getContext().fileSampleAnnotation;
    this.requestAnalytics.bucketAttributeAnnotation = this.contextService.getContext().bucketAttributeAnnotation;
    this.requestAnalytics.fileAttributeAnnotation = this.contextService.getContext().fileAttributeAnnotation;

    // set Chart title
    this.chartAnalytics.chart.config.options.plugins.title.text = this.analyticsFormViewGroup.get('title').value;

    // execute analytics histogram service
    this.hiddenSpinner = false;
    this.analyticsService.executeHistogram(this.requestAnalytics)
      .subscribe({
        next: responseAnalytics => {
          this.responseAnalytics = responseAnalytics;

          this.fillDataChart();

          this.hiddenSpinner = true;
        },
        error: error => {
          console.error(error.message);

          this.hiddenSpinner = true;
        }
      }); 
  }
}
