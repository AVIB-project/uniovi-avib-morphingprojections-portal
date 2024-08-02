import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';
import { ProgressBarModule } from 'primeng/progressbar';

import { OrganizationComponent } from './organization.component';
import { OrganizationRoutingModule } from './organization-routing.module';

@NgModule({
	imports: [
		CommonModule,
		OrganizationRoutingModule,
		RippleModule,
		ButtonModule,
		InputTextModule,
		TableModule,
		TreeTableModule,
		ProgressBarModule
	],
	declarations: [OrganizationComponent]
})
export class OrganizationModule { }