import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OrganizationComponent } from './organization.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: OrganizationComponent }
	])],
	exports: [RouterModule]
})
export class OrganizationRoutingModule { }
