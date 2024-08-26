import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToolbarModule } from 'primeng/toolbar';
import { ChartModule } from 'primeng/chart';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';

import { AnalyticsDataFormViewComponent } from './analytics-data-form-view.component';

import { AnalyticsHistogramComponent } from './analytics-histogram/analytics-histogram.component';
import { AnalyticsLogisticRegressionComponent } from './analytics-logistic-regression/analytics-logistic-regression.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,    
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    DropdownModule,
    SplitButtonModule,
    RadioButtonModule,
    ToolbarModule,
    ChartModule,
    DividerModule,
    ProgressSpinnerModule,
    TabViewModule,
    TableModule
  ],
  declarations: [
    AnalyticsHistogramComponent,
    AnalyticsLogisticRegressionComponent,
    AnalyticsDataFormViewComponent,
  ],
  exports: [
    AnalyticsDataFormViewComponent
  ],
})
export class AnalyticsDataFormViewModule { }
