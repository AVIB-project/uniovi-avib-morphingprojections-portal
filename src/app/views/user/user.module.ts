import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { UserInviteFormModule } from '../user-invite-form/user-invite-form.module';
import { UserRoutingModule } from './user-routing.module';

import { UserComponent } from './user.component';

@NgModule({
	imports: [
		CommonModule,
		UserRoutingModule,
		RippleModule,
		ButtonModule,
		InputTextModule,
		TableModule,
		TreeTableModule,
		ProgressBarModule,
		TooltipModule,
		ConfirmDialogModule,
		UserInviteFormModule
	],
	declarations: [UserComponent]
})
export class UserModule { }