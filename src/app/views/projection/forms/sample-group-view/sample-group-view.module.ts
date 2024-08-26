import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { AutoFocusModule } from 'primeng/autofocus';

import { SampleGroupViewComponent } from './sample-group-view.component';
import { SampleGroupFormViewComponent } from './sample-group-form-view/sample-group-form-view.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
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
    AutoFocusModule
  ],
  declarations: [
    SampleGroupViewComponent,
    SampleGroupFormViewComponent
  ],
  exports: [
    SampleGroupViewComponent
  ],
})
export class SampleGroupViewModule { }
