import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { TabViewModule } from 'primeng/tabview';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { SliderModule } from 'primeng/slider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { SidebarModule } from 'primeng/sidebar';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ListboxModule } from 'primeng/listbox';
import { FieldsetModule } from 'primeng/fieldset';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { ColorPickerModule } from 'primeng/colorpicker';

import { SampleDataViewComponent } from './sample-data-view.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TabViewModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    MultiSelectModule,
    TableModule,
    SliderModule,
    ProgressSpinnerModule,
    ProgressBarModule,
    TooltipModule,
    SidebarModule,
    DynamicDialogModule,
    OverlayPanelModule,
    ListboxModule,
    FieldsetModule,
    BadgeModule,
    DividerModule,
    CheckboxModule,
    ColorPickerModule,
  ],
  declarations: [
    SampleDataViewComponent,
  ],
  exports: [
    SampleDataViewComponent
  ],
})
export class SampleDataViewModule { }
