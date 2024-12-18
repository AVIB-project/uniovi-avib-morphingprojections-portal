import { Component, OnInit, Input,  ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { UIChart } from 'primeng/chart';

import { ContextService } from '../../../../../shared/services/context.service';
import { AnalyticsService } from '../../../../../shared/services/analytics.service';

import { ViewTypeEnum } from '../../../../../shared/enum/view-type.enum';

export function groupsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    // Check if the value is an array and its length is 2
    if (Array.isArray(value) && value.length === 2) {
      return null; // Valid
    }

    // Return an error if invalid
    return { arrayLengthTwo: { valid: false, actualLength: Array.isArray(value) ? value.length : 'not exist 2 groups' } };
  };
}

@Component({
  selector: 'analytics-logistic-regression',
  templateUrl: './analytics-logistic-regression.component.html',
  styleUrls: ['./analytics-logistic-regression.component.scss'],
})
export class AnalyticsLogisticRegressionComponent implements OnInit {
  readonly LANGUAGE_ID = "us"; // English: us; Spanish: es
  
  @Input() viewInput: ViewTypeEnum = ViewTypeEnum.SAMPLE_VIEW;
  @Input() groupsInput: any[];
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
  showFilterAttributeAnnotationPanel: boolean   = false;
  
  analyticsFormViewGroup = this.fb.group({
    name: ['Logistic Regression Name', Validators.required],      
    title: ['Logistic Regression Description', Validators.required],
    view: [this.viewInput, Validators.required],
    groups: new FormControl<any[] | null>([], [groupsValidator()]),
  });

  readonly documentStyle = getComputedStyle(document.documentElement);
  readonly textColor = this.documentStyle.getPropertyValue('--text-color');
  readonly textColorSecondary = this.documentStyle.getPropertyValue('--text-color-secondary');
  readonly surfaceBorder = this.documentStyle.getPropertyValue('--surface-border');
  
  options: any;
  requestAnalytics: any;
  responseAnalytics: any;
  dataChart: any;
  dataTable: any;
  
  hiddenSpinner: boolean = true;

  constructor(private contextService: ContextService,
              private fb: FormBuilder,
              private analyticsService: AnalyticsService) { }

  ngOnInit() {
    // fill filters data 
    this.fillSamples();
    this.fillSampleAnnotations();
    this.fillAttributes();
    this.fillAttributeAnnotations();

    // initialize filter and chart components
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
      this.attributeAnnotations.push({ key: attributeAnnotation.attributeId, value: attributeAnnotation.attributeId })
    );
  }
  
  private initChartComponent() {    
    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        title: {
          display: true,
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
    this.dataChart = { labels: [], datasets: [] };
    
    if (this.dataChart == undefined || this.responseAnalytics.length == 0)
      return;
    
    this.dataChart.labels = this.responseAnalytics.map(a => a.attribute);
    this.dataChart.datasets = [
      {
        //label: 'mi-RNA Relevance',
        label: 'Relevance',
        data: this.responseAnalytics.map(a => a.value),
        fill: false,
        borderColor: this.documentStyle.getPropertyValue('--blue-500'),
        tension: 0.4
      }
    ]
  }

  private fillDataTable() {
    this.dataTable = this.responseAnalytics;
  }

  private parseGroups() {
    let groups: any[] = [];

    this.analyticsFormViewGroup.get('groups').value.forEach(group => {
      groups.push({
        name: group.name,
        color: group.color,
        values: group.samples.map(sample => sample.sample_id)
      })      
    });

    this.analyticsFormViewGroup.get('groups').setValue(groups);
  }

  onCalculateClick(event) {  
    // parse groups
    this.parseGroups();
    
    // get analytics request parameters
    this.requestAnalytics = this.analyticsFormViewGroup.value;      
    this.requestAnalytics.attributes = this.attributeAnnotations;
   
    // add resource request metadata
    this.requestAnalytics.bucketDataMatrix = this.contextService.getContext().bucketDataMatrix;
    this.requestAnalytics.fileDataMatrix = this.contextService.getContext().fileDataMatrix;
    this.requestAnalytics.bucketSampleAnnotation = this.contextService.getContext().bucketSampleAnnotation;
    this.requestAnalytics.fileSampleAnnotation = this.contextService.getContext().fileSampleAnnotation;
    this.requestAnalytics.bucketAttributeAnnotation = this.contextService.getContext().bucketAttributeAnnotation;
    this.requestAnalytics.fileAttributeAnnotation = this.contextService.getContext().fileAttributeAnnotation;

    // set Chart title
    this.chartAnalytics.chart.config.options.plugins.title.text = this.analyticsFormViewGroup.get('title').value;
    
    this.hiddenSpinner = false;
    this.analyticsService.executeLogisticRegression(this.requestAnalytics)
      .subscribe({
        next: responseAnalytics => {
          this.responseAnalytics = responseAnalytics;

          this.fillDataChart();
          this.fillDataTable();

          this.analyticsFormViewGroup.get('groups').setValue([]);

          this.hiddenSpinner = true;
        },
        error: error => {
          console.error(error.message);

          this.hiddenSpinner = true;
        }
      }); 
  }
}
