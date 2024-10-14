import { Component, OnInit, Input,  ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';

import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

import { ContextService } from '../../../../../shared/services/context.service';

import { AnalyticsService } from '../../../../../shared/services/analytics.service';

import { ViewTypeEnum } from '../../../../../shared/enum/view-type.enum';
import { UIChart } from 'primeng/chart';

@Component({
  selector: 'analytics-logistic-regression',
  templateUrl: './analytics-logistic-regression.component.html',
  styleUrls: ['./analytics-logistic-regression.component.scss'],
})
export class AnalyticsLogisticRegressionComponent implements OnInit {
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
  showFilterAttributeAnnotationPanel: boolean   = false;
  
  analyticsFormViewGroup = this.fb.group({
    name: ['Logistic Regression Name', Validators.required],      
    title: ['Logistic Regression Description', Validators.required],
    view: new FormControl<string | null>(null),
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
  dataChart: any;
  dataTable: any;
  
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
      this.attributeAnnotations.push({ key: attributeAnnotation.attributeId, value: attributeAnnotation.attributeId })
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
        label: 'mi-RNA Relevance',
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

  onCalculateClick(event) {    
    this.requestAnalytics = this.analyticsFormViewGroup.value;    
    this.requestAnalytics.attributes = this.attributeAnnotations;
    //this.requestAnalytics.indexDataMatrix = this.contextService.getContext().indexDataMatrix //TODO
    
    // set Chart title
    this.chartAnalytics.chart.config.options.plugins.title.text = this.analyticsFormViewGroup.get('title').value;
    
    this.hiddenSpinner = false;
    this.analyticsService.executeLogisticRegression(this.requestAnalytics)
      .subscribe({
        next: responseAnalytics => {
          this.responseAnalytics = responseAnalytics;

          this.fillDataChart();
          this.fillDataTable();

          this.hiddenSpinner = true;
        },
        error: error => {
          console.error(error.message);

          this.hiddenSpinner = true;
        }
      }); 
  }
}
