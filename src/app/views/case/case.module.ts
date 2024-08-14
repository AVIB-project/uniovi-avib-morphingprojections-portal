import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';
import { ProgressBarModule } from 'primeng/progressbar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MenuModule } from 'primeng/menu';

import { CaseComponent } from './case.component';
import { CaseRoutingModule } from './case-routing.module';

@NgModule({
	imports: [
		CommonModule,
		CaseRoutingModule,
		RippleModule,
		ButtonModule,
		InputTextModule,
		TableModule,
		TreeTableModule,
		ProgressBarModule,
		OverlayPanelModule,
		MenuModule
	],
	declarations: [CaseComponent]
})
export class CaseModule { }