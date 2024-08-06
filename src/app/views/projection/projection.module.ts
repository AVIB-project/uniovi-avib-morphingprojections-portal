import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';
import { ProgressBarModule } from 'primeng/progressbar';

import { ProjectionComponent } from './projection.component';
import { ProjectionRoutingModule } from './projection-routing.module';

@NgModule({
	imports: [
		CommonModule,
		ProjectionRoutingModule,
		RippleModule,
		ButtonModule,
		InputTextModule,
		TableModule,
		TreeTableModule,
		ProgressBarModule
	],
	declarations: [ProjectionComponent]
})
export class ProjectionModule { }