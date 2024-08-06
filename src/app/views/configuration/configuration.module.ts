import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';
import { ProgressBarModule } from 'primeng/progressbar';

import { ConfigurationComponent } from './configuration.component';
import { ConfigurationRoutingModule } from './configuration-routing.module';


@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ButtonModule,
		RippleModule,
		InputTextModule,
		TableModule,
		TreeTableModule,
		ProgressBarModule,
		ConfigurationRoutingModule,
	],
	declarations: [ConfigurationComponent]
})
export class ConfigurationModule { }
