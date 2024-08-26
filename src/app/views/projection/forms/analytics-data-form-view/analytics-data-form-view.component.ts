import { Component } from '@angular/core';

import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { ViewTypeEnum } from '../../../../shared/enum/view-type.enum';

@Component({
  selector: 'analytics-data-form-view.component',
  templateUrl: './analytics-data-form-view.component.html',
  styleUrls: ['./analytics-data-form-view.component.scss'],
})
export class AnalyticsDataFormViewComponent {
  readonly LANGUAGE_ID = "us"; // English: us; Spanish: es

  readonly analytics = [
    { key: "histogram", name: "Histogram" },
    { key: "logistic_regression", name: "Logistic regression" },
    { key: "anova", name: "ANOVA" },
    { key: "pearson_correlation", name: "Pearson correlation" },    
  ];

  selectedAnalyticsKey: any = "histogram";
  
  view: ViewTypeEnum;
  groups: any = [];
  samples: any[] = [];
  sampleAnnotations: any[] = [];
  attributes: any[] = [];
  attributeAnnotations: any[] = [];
  
  constructor(private config: DynamicDialogConfig) {
    this.view = this.config.data.view;
    this.groups = this.config.data.groups;
    this.samples = this.config.data.samples;
    this.sampleAnnotations = this.config.data.sampleAnnotations;    
    this.attributes = this.config.data.attributes;
    this.attributeAnnotations = this.config.data.attributeAnnotations;
  }
}
