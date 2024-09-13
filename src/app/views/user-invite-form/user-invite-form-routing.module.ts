import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UserInviteFormComponent } from './user-invite-form.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: UserInviteFormComponent }
	])],
	exports: [RouterModule]
})
export class UserInviteFormRoutingModule { }
