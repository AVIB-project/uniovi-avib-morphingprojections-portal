import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

import { UserInviteFormComponent } from './user-invite-form.component';
import { UserInviteFormRoutingModule } from './user-invite-form-routing.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		ButtonModule,
		RippleModule,
		InputTextModule,
		DropdownModule,
		FileUploadModule,
		InputTextareaModule,
		InputGroupModule,
		InputGroupAddonModule,
		UserInviteFormRoutingModule,
	],
	declarations: [UserInviteFormComponent]
})
export class UserInviteFormModule { }
