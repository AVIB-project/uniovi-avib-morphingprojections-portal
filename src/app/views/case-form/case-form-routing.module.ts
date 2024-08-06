import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CaseFormComponent } from './case-form.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CaseFormComponent }
	])],
	exports: [RouterModule]
})
export class CaseFormRoutingModule { }
