import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RippleModule } from 'primeng/ripple';
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
import { SelectButtonModule } from 'primeng/selectbutton';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ContextMenuModule } from 'primeng/contextmenu';
import { ToastModule } from 'primeng/toast';

import { RxStompService } from '../../shared/websocket/rx-stomp.service';
import { RxStompServiceFactory } from '../../shared/websocket/rx-stomp-service-factory';

//import { SampleDataViewModule } from './forms/sample-data-view/sample-data-view.module';
//import { SampleGroupViewModule } from './forms/sample-group-view/sample-group-view.module';
//import { AnalyticsDataFormViewModule } from './forms/analytics-data-form-view/analytics-data-form-view.module';

import { ProjectionComponent } from './projection.component';
import { ProjectionRoutingModule } from './projection-routing.module';

import { AnnotationFilterGroupPipe } from '../../shared/pipe/annotation-filter-group.pipe';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ProjectionRoutingModule,
		RippleModule,
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
		SelectButtonModule,
		ScrollPanelModule,
		ContextMenuModule,
		//SampleDataViewModule,
    	//SampleGroupViewModule,
    	//AnalyticsDataFormViewModule,
		ToastModule,
	],
	declarations: [
		ProjectionComponent,
		AnnotationFilterGroupPipe
	],
	providers: [
		{
			provide: RxStompService,
			useFactory: RxStompServiceFactory,
		},
	],	
})
export class ProjectionModule { }