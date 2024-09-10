import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';

import { EncodingComponent } from './encoding.component';
import { EncodingRoutingModule } from './encoding-routing.module';

@NgModule({
	imports: [
		CommonModule,
		EncodingRoutingModule,
		RippleModule,
		ButtonModule,
		InputTextModule,
		TableModule,
		TreeTableModule,
		ProgressBarModule,
		TooltipModule
	],
	declarations: [EncodingComponent]
})
export class EncodingModule { }