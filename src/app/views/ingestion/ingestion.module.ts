import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';
import { ProgressBarModule } from 'primeng/progressbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
	
import { IngestionComponent } from './ingestion.component';
import { IngestionRoutingModule } from './ingestion-routing.module';

@NgModule({
	imports: [
		CommonModule,
		IngestionRoutingModule,
		RippleModule,
		ButtonModule,
		InputTextModule,
		TableModule,
		TreeTableModule,
		ProgressBarModule,
		ConfirmDialogModule,
		TooltipModule
	],
	declarations: [IngestionComponent]
})
export class IngestiongModule { }