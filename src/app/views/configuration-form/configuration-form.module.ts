import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

import { ConfigurationFormComponent } from './configuration-form.component';
import { ConfigurationFormRoutingModule } from './configuration-form-routing.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ButtonModule,
		RippleModule,
		InputTextModule,
		DropdownModule,
		FileUploadModule,
		InputTextareaModule,
		InputGroupModule,
		InputGroupAddonModule,
		ConfigurationFormRoutingModule,
	],
	declarations: [ConfigurationFormComponent]
})
export class ConfigurationFormModule { }
